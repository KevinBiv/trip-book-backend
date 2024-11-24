const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
// const { protect } = require('../middleware/auth'); // If you have auth middleware

// Public routes
router.get('/', feedbackController.getAllFeedbacks);
router.get('/stats', feedbackController.getFeedbackStats);

// Protected routes (optional)
router.post('/', feedbackController.createFeedback);
router.patch('/:id/status', feedbackController.updateFeedbackStatus);

module.exports = router;