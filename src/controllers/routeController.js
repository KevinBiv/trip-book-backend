// src/controllers/routeController.js
const Route = require('../models/Route');

// Get all routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single route
exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create route
exports.createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    const newRoute = await route.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete route
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};