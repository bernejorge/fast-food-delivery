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
        include: ["lineasOrden"],
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
  agregarLineasOrden: async (req, res) => {
    try {
      const ordenId = req.body.id; // El ID de la orden se obtiene del cuerpo de la solicitud
      const lineas = req.body.lineas; // Array de líneas de orden desde el cuerpo de la solicitud
  
      // Obtener la orden existente
      let orden = await Orden.findByPk(ordenId, { include: ['lineasOrden'] });
      if (!orden) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }
  
      // Calcular el nuevo importe total
      let importeAdicional = 0;
      for (const linea of lineas) {
        const producto = await Producto.findByPk(linea.id_producto_ordenado);
        if (!producto) {
          return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        importeAdicional += producto.precio * linea.cantidad;
      }
  
      // Actualizar el importe total de la orden
      orden.importe += importeAdicional;
      await orden.save();
  
      // Añadir nuevas líneas de orden
      for (const linea of lineas) {
        await LineaOrden.create({ ...linea, ordenId: ordenId });
      }
  
      // Recuperar la orden actualizada con todas sus líneas de orden
      orden = await Orden.findByPk(ordenId, { include: ['lineasOrden'] });
      res.json(orden);
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
       include: [{
         model: LineaOrden,
         as: 'lineasOrden',
         include: [{ 
           model: Producto,
           as: 'producto' // Asegúrate de que 'producto' sea el alias correcto en tu asociación
         }]
       }]
     });
 
     if (!orden) {
       return res.status(404).json({ message: 'Orden no encontrada.' });
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
      whereConditions.estado = estados.split(','); // asumiendo que 'estados' es una lista separada por comas
    }

    // Buscar órdenes que coincidan con los filtros
    const ordenes = await Orden.findAll({
      where: whereConditions,
      include: ['lineasOrden'] // Incluir líneas de orden
    });

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

 
  // Agregar otros métodos CRUD según sea necesario
};

module.exports = ordenesController;
