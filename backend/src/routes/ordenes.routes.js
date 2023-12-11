const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenes.controller');

router.post('/', ordenesController.create);

// Agregar otras rutas CRUD según sea necesario
router.post('/agregar-lineas', ordenesController.agregarLineasOrden);

router.delete('/orden/:ordenId/linea/:lineaOrdenId', ordenesController.eliminarLineaOrden);

router.get('/:id', ordenesController.getById);

module.exports = router;
