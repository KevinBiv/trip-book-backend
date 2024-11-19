const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');

// Get all schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('bus', 'plateNumber driver type')
      .sort({ createdAt: -1 });
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create schedule
exports.createSchedule = async (req, res) => {
  try {
    // Verify bus exists and is active
    const bus = await Bus.findById(req.body.bus);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    if (bus.status !== 'active') {
      return res.status(400).json({ message: 'Selected bus is not active' });
    }

    const schedule = new Schedule(req.body);
    const newSchedule = await schedule.save();
    
    // Populate bus details before sending response
    await newSchedule.populate('bus', 'plateNumber driver type');
    
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update schedule status
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('bus', 'plateNumber driver type');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};