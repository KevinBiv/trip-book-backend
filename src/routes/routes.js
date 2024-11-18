// src/routes/routes.js
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.get('/', routeController.getRoutes);
router.get('/:id', routeController.getRoute);
router.post('/', routeController.createRoute);
router.put('/:id', routeController.updateRoute);
router.delete('/:id', routeController.deleteRoute);

module.exports = router;