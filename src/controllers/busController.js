// src/controllers/busController.js
const Bus = require('../models/Bus');

// Get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single bus
exports.getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create bus
exports.createBus = async (req, res) => {
  try {
    // Check if bus with plate number already exists
    const existingBus = await Bus.findOne({ plateNumber: req.body.plateNumber });
    if (existingBus) {
      return res.status(400).json({ message: 'Bus with this plate number already exists' });
    }

    const bus = new Bus(req.body);
    const newBus = await bus.save();
    res.status(201).json(newBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // If plate number is being updated, check if it already exists
    if (req.body.plateNumber && req.body.plateNumber !== bus.plateNumber) {
      const existingBus = await Bus.findOne({ plateNumber: req.body.plateNumber });
      if (existingBus) {
        return res.status(400).json({ message: 'Bus with this plate number already exists' });
      }
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    await bus.remove();
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};