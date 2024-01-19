const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenes.controller');

router.post('/', ordenesController.create);

// Agregar otras rutas CRUD según sea necesario
router.post('/agregar-lineas', ordenesController.agregarLineasOrden);

router.delete('/orden/:ordenId/linea/:lineaOrdenId', ordenesController.eliminarLineaOrden);

router.delete('/:ordenId', ordenesController.eliminarOrden);

router.get('/:id', ordenesController.getById);

router.post('/confirmar', ordenesController.confirmarOrden);

router.post('/quitarProductosOrdenados', ordenesController.restarProductosOrdenados);
router.get('/buscarOrdenesPorTelefonoNoFinalizadas/:telefono', ordenesController.buscarOrdenesPorTelefonoNoFinalizadas);
router.post('/buscarOrdenes', ordenesController.buscarOrdenes);

module.exports = router;
