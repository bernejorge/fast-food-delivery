const db = require("../models");
const Orden = db.Orden;
const LineaOrden = db.LineaOrden;
const Producto = db.Producto;

const ordenesController = {
  create: async (req, res) => {
    let transaction;

    try {
      // Iniciar transacción
      transaction = await db.sequelize.transaction();

      // Calcular el importe total de la orden
      let importeTotal = 0;
      for (const linea of req.body.lineasOrden) {
        const producto = await Producto.findByPk(linea.id_producto_ordenado, {
          transaction,
        });
        if (!producto) {
          throw new Error("Producto no encontrado");
        }
        importeTotal +=
          parseFloat(producto.precio) * parseInt(linea.cantidad, 10);
      }

      // Crear la orden
      const ordenData = {
        ...req.body.orden,
        importe: importeTotal.toFixed(2), // Asegurar que el importe es un string con dos decimales
        fecha: new Date(),
      };
      const nuevaOrden = await Orden.create(ordenData, { transaction });

      // Agregar líneas de orden con precio unitario actualizado
      const lineasPromises = req.body.lineasOrden.map(async (linea) => {
        const producto = await Producto.findByPk(linea.id_producto_ordenado, {
          transaction,
        });
        if (!producto) {
          throw new Error("Producto no encontrado");
        }
        return LineaOrden.create(
          {
            ...linea,
            ordenId: nuevaOrden.id,
            precio_unitario: producto.precio, // Asegúrate de que este es el campo correcto en tu modelo Producto
          },
          { transaction }
        );
      });

      await Promise.all(lineasPromises);

      // Obtener la orden completa con líneas de orden para la respuesta
      const ordenCompleta = await Orden.findByPk(nuevaOrden.id, {
        include: [
          {
            model: LineaOrden,
            as: "lineasOrden",
            include: [
              {
                model: Producto,
                as: "producto", // Asegúrate de que 'producto' sea el alias correcto en tu asociación
              },
            ],
          },
        ],
        transaction,
      });

      // Confirmar transacción
      await transaction.commit();
      res.status(201).json(ordenCompleta);
    } catch (error) {
      // Si hay un error, revertir la transacción
      if (transaction) await transaction.rollback();
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  },
  eliminarOrden: async (req, res) =>{
    try {
      transaction = await db.sequelize.transaction();
      const { ordenId } = req.params;

      // Recuperar la orden
      const orden = await Orden.findByPk(ordenId, { transaction });
      if (!orden) {
        await transaction.rollback();
        return res.status(404).json({ message: "Orden no encontrada." });
      }

      await orden.destroy({ transaction });
      await transaction.commit();

      return res.status(200).json({ message: "Orden eliminada" }); 

    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
  agregarLineasOrden: async (req, res) => {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const { id, lineas } = req.body;

      // Recuperar la orden
      const orden = await Orden.findByPk(id, { transaction });
      if (!orden) {
        await transaction.rollback();
        return res.status(404).json({ message: "Orden no encontrada." });
      }

      // Agregar o actualizar líneas de orden
      for (const nuevaLinea of lineas) {
        const [lineaOrden, created] = await LineaOrden.findOrCreate({
          where: {
            ordenId: orden.id,
            id_producto_ordenado: nuevaLinea.id_producto_ordenado,
          },
          defaults: { ...nuevaLinea, ordenId: orden.id },
          transaction,
        });

        if (!created) {
          lineaOrden.cantidad += nuevaLinea.cantidad;
          await lineaOrden.save({ transaction });
        }
      }
      const ordenActualizada = await Orden.findByPk(id, {
        include: [
          {
            model: LineaOrden,
            as: "lineasOrden",
            include: [
              {
                model: Producto,
                as: "producto", // Asegúrate de que 'producto' sea el alias correcto en tu asociación
              },
            ],
          },
        ],
        transaction,
      });

      
      // Recalcular el importe
      ordenActualizada.importe = await recalcularImporte(ordenActualizada);
      await ordenActualizada.save({ transaction });

      await transaction.commit();
      res.json(ordenActualizada);
    } catch (error) {
      if (transaction) await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
  restarProductosOrdenados: async (req, res) => {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();

      const { ordenId, id_producto_ordenado, cantidadARestar } = req.body;

      // Recuperar la orden
      const orden = await Orden.findByPk(ordenId, {
        include: ["lineasOrden"],
        transaction,
      });

      if (!orden) {
        await transaction.rollback();
        return res.status(404).json({ message: "Orden no encontrada." });
      }

      // Buscar la línea de orden que contenga el producto
      const lineaOrden = orden.lineasOrden.find(
        (linea) => linea.id_producto_ordenado === id_producto_ordenado
      );
      if (!lineaOrden) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "Línea de orden no encontrada para el producto." });
      }

      if (cantidadARestar >= lineaOrden.cantidad) {
        // Eliminar la línea de orden si la cantidad a restar es mayor o igual
        await lineaOrden.destroy({ transaction });
        // Recargar la orden para actualizar las líneas de orden en memoria
        const ordenActualizada = await Orden.findByPk(ordenId, {
          include: ["lineasOrden"],
          transaction,
        });
        orden.lineasOrden = ordenActualizada.lineasOrden;
      } else {
        // Restar la cantidad y actualizar la línea de orden
        lineaOrden.cantidad -= cantidadARestar;
        await lineaOrden.save({ transaction });
      }

      // Recalcular y actualizar el importe total de la orden
      // La función recalcularImporte debe estar definida para calcular correctamente el importe
      orden.importe = await recalcularImporte(orden);
      await orden.save({ transaction });

      await transaction.commit();
      res.json(orden);
    } catch (error) {
      if (transaction) await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
  buscarOrdenesPorTelefonoNoFinalizadas: async (req, res) => {
    try {
      const { telefono } = req.params;
      const estadosPermitidos = [
        "Pendiente",
        "Confirmado",
        "En Progreso",
        "Preparado",
        "En Transito",
      ];

      const ordenes = await Orden.findAll({
        where: {
          telefono: telefono,
          estado: {
            [db.Sequelize.Op.in]: estadosPermitidos,
          },
        },
        include: [
          {
            model: LineaOrden,
            as: "lineasOrden",
            include: [
              {
                model: Producto,
                as: "producto", // Asegúrate de que 'producto' sea el alias correcto en tu asociación
              },
            ],
          },
        ],
      });

      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  eliminarLineaOrden: async (req, res) => {
    try {
      const { ordenId, lineaOrdenId } = req.params; // Asume que ambos ID vienen como parámetros de ruta

      // Primero, verifica si la orden existe
      const orden = await Orden.findByPk(ordenId);
      if (!orden) {
        return res.status(404).json({ message: "Orden no encontrada." });
      }

      // Luego, busca y elimina la línea de orden específica
      const lineaOrden = await LineaOrden.findOne({
        where: { id: lineaOrdenId, ordenId: ordenId },
      });
      if (!lineaOrden) {
        return res
          .status(404)
          .json({ message: "Línea de orden no encontrada." });
      }

      await lineaOrden.destroy();
      res.status(200).json({ message: "Línea de orden eliminada con éxito." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const ordenId = req.params.id;
      const orden = await Orden.findByPk(ordenId, {
        include: [
          {
            model: LineaOrden,
            as: "lineasOrden",
            include: [
              {
                model: Producto,
                as: "producto", // Asegúrate de que 'producto' sea el alias correcto en tu asociación
              },
            ],
          },
        ],
      });

      if (!orden) {
        return res.status(404).json({ message: "Orden no encontrada." });
      }

      res.json(orden);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarOrdenes: async (req, res) => {
    try {
      // Obtener parámetros de filtro de la solicitud
      const { telefono, estados } = req.query;

      // Construir condiciones de búsqueda
      let whereConditions = {};
      if (telefono) {
        whereConditions.telefono = telefono;
      }
      if (estados) {
        whereConditions.estado = estados.split(","); // asumiendo que 'estados' es una lista separada por comas
      }

      // Buscar órdenes que coincidan con los filtros
      const ordenes = await Orden.findAll({
        where: whereConditions,
        include: ["lineasOrden"], // Incluir líneas de orden
      });

      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  confirmarOrden: async (req, res) => {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const { ordenId } = req.body;

      const orden = await Orden.findByPk(ordenId, { transaction });
      if (!orden) {
        await transaction.rollback();
        return res.status(404).json({ message: "Orden no encontrada." });
      }

      if (orden.estado !== "Pendiente") {
        await transaction.rollback();
        return res
          .status(400)
          .json({
            message: "Solo se pueden confirmar órdenes en estado Pendiente.",
          });
      }

      orden.estado = "Confirmado";
      orden.fechaConfirmado = new Date();
      await orden.save({ transaction });

      const userThread = await db.UserThread.findOne({
        where: { telefono: orden.telefono },
        transaction,
      });
      if (userThread) {
        userThread.thread_id = null; // o db.NULL si es necesario
        await userThread.save({ transaction });
      }

      const ordenActualizada = await Orden.findByPk(ordenId, {
        include: ["lineasOrden"], // Incluye detalles adicionales si es necesario
        transaction,
      });

      await transaction.commit();

      const eta = await TiempoEstimadoPreparacion();

      const data = {
        orden : ordenActualizada,
        tiempo_estimado_entrega: eta == 0 ? 'as soon as possible' : eta + ' minutes',
      }

      res.json(data);
    } catch (error) {
      if (transaction) await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Agregar otros métodos CRUD según sea necesario
};

async function recalcularImporte(orden) {
  let importeTotal = 0;

  // Iterar sobre cada línea de orden para sumar el importe
  for (const linea of orden.lineasOrden) {
    importeTotal += linea.precio_unitario * linea.cantidad;
  }

  return importeTotal;
}

async function TiempoEstimadoPreparacion() {
  const fechaHoy = new Date();
  fechaHoy.setHours(0, 0, 0, 0); // Establece la fecha al inicio del día

  const ordenes = await Orden.findAll({
    where: {
      estado: {
        [db.Sequelize.Op.or]: ['En Transito', 'Entregado']
      },
      fechaConfirmado: {
        [db.Sequelize.Op.gte]: fechaHoy
      },
      fechaEnTransito: {
        [db.Sequelize.Op.ne]: null
      }
    },
    order: [['fechaConfirmado', 'DESC']],
    limit: 100
  });

  let sumaDiferencias = 0;
  let contadorOrdenes = 0;

  ordenes.forEach(orden => {
    if (orden.fechaConfirmado && orden.fechaEnTransito) {
      sumaDiferencias += (orden.fechaEnTransito - orden.fechaConfirmado);
      contadorOrdenes++;
    }
  });

  return contadorOrdenes > 0 ? (sumaDiferencias / contadorOrdenes) / 1000 / 60 : 0; // Retorna el promedio en minutos
}

module.exports = ordenesController;
