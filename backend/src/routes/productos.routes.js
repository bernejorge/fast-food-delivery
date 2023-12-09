const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.getAll);
router.get('/:id', productosController.getById);
router.post('/', productosController.create);
router.patch('/:id', productosController.update);
router.delete('/:id', productosController.delete);

module.exports = router;
