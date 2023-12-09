const express = require('express');
const router = express.Router();

const db = require('../models');
const repository = db.Categoria;

// Obtener todas las categorías
router.get('/', (req, res) => {
    repository.findAll()
    .then(categorias => res.json(categorias))
    .catch(err => res.json(err));
});

// Obtener una categoría por su ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const categoria = await repository.findByPk(id);
    if (!categoria) {
        res.status(404).json({ message: 'Categoría no encontrada.' });
    } else {
        res.json(categoria);
    }
});

// Crear una nueva categoría
router.post('/', (req, res) => {
    const categoria = repository.build(req.body);
    categoria.save()
    .then(savedCategoria => res.json(savedCategoria))
    .catch(err => res.json(err));
});

// Actualizar una categoría
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const categoria = await repository.findByPk(id);
    if (!categoria) {
        res.status(404).json({ message: 'Categoría no encontrada.' });
    } else {
        const updatedCategoria = await categoria.update(data);
        res.json(updatedCategoria);
    }
});

// Eliminar una categoría
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const categoria = await repository.findByPk(id);
    if (!categoria) {
        res.status(404).json({ message: 'Categoría no encontrada.' });
    } else {
        await categoria.destroy();
        res.status(200).json({ message: 'Categoría eliminada.' });
    }
});

module.exports = router;
