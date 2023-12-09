const db = require('../models');
const Categoria = db.Categoria;

const categoriasController = {
  // Obtener todas las categorías
  getAll: async (req, res) => {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una categoría por su ID
  getById: async (req, res) => {
    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una nueva categoría
  create: async (req, res) => {
    try {
      const nuevaCategoria = await Categoria.create(req.body);
      res.json(nuevaCategoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar una categoría
  update: async (req, res) => {
    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      const actualizadaCategoria = await categoria.update(req.body);
      res.json(actualizadaCategoria);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar una categoría
  delete: async (req, res) => {
    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      await categoria.destroy();
      res.status(200).json({ message: 'Categoría eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = categoriasController;
