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

exports.searchSchedules = async (req, res) => {
    try {
      const { from, to, date } = req.query;
  
      if (!from || !to || !date) {
        return res.status(400).json({
          message: 'Missing required search parameters'
        });
      }
  
      // Convert date string to Date object for comparison
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
  
      // Get day of week for the search date
      const dayOfWeek = searchDate.toLocaleDateString('en-US', { weekday: 'short' });
  
      const searchQuery = {
        from: { $regex: new RegExp(from, 'i') },
        to: { $regex: new RegExp(to, 'i') },
        status: { $ne: 'cancelled' },
        $or: [
          {
            scheduleType: 'one-time',
            date: {
              $gte: searchDate,
              $lt: nextDay
            }
          },
          {
            scheduleType: 'recurring',
            recurringDays: dayOfWeek
          }
        ]
      };
  
      const schedules = await Schedule.find(searchQuery)
        .populate('bus', 'plateNumber driver type status')
        .sort('departureTime');
  
      // Transform schedules to match frontend needs using only available data
      const transformedSchedules = schedules.map(schedule => ({
        id: schedule._id,
        from: schedule.from,
        to: schedule.to,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        price: schedule.price,
        status: schedule.status,
        bus: {
          plateNumber: schedule.bus.plateNumber,
          driver: schedule.bus.driver,
          type: schedule.bus.type,
          status: schedule.bus.status
        }
      }));
  
      res.json({
        schedules: transformedSchedules,
        totalResults: transformedSchedules.length
      });
  
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ 
        message: 'Error searching schedules',
        error: error.message 
      });
    }
  };