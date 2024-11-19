// src/models/Bus.js
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    unique: true,
    trim: true
  },
  driver: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Express'],
    required: [true, 'Bus type is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);