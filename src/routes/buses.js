// src/routes/buses.js
const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// GET /api/buses - Get all buses
router.get('/', busController.getBuses);

// GET /api/buses/:id - Get single bus
router.get('/:id', busController.getBus);

// POST /api/buses - Create new bus
router.post('/', busController.createBus);

// PUT /api/buses/:id - Update bus
router.put('/:id', busController.updateBus);

// DELETE /api/buses/:id - Delete bus
router.delete('/:id', busController.deleteBus);

module.exports = router;