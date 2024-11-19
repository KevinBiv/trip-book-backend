const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  from: {
    type: String,
    required: [true, 'Departure point is required']
  },
  to: {
    type: String,
    required: [true, 'Destination is required']
  },
  scheduleType: {
    type: String,
    enum: ['one-time', 'recurring'],
    required: true
  },
  date: {
    type: Date,
    required: function() { return this.scheduleType === 'one-time'; }
  },
  recurringDays: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }],
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  notes: String,
  status: {
    type: String,
    enum: ['scheduled', 'in-transit', 'cancelled'],
    default: 'scheduled'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Schedule', scheduleSchema);