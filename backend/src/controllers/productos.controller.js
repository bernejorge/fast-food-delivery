const db = require('../models');
const Producto = db.Producto;

const productosController = {
    getAll: async (req, res) => {
        try {
            const productos = await Producto.findAll();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const nuevoProducto = await Producto.create(req.body);
            res.json(nuevoProducto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            const actualizadoProducto = await producto.update(req.body);
            res.json(actualizadoProducto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await producto.destroy();
            res.status(200).json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productosController;
