const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getSchedules);
router.post('/', scheduleController.createSchedule);
router.patch('/:id/status', scheduleController.updateScheduleStatus);
router.get('/search', scheduleController.searchSchedules);

module.exports = router;