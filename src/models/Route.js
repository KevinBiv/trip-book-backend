// src/models/Route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Route name is required']
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Estimated duration is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);