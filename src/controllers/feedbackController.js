// controllers/feedbackController.js
const Feedback = require('../models/Feedback');

// Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { rating, comment, companyId } = req.body;

    // Basic validation
    if (!rating || !comment || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Rating, comment and company ID are required'
      });
    }

    // Create feedback
    const feedback = new Feedback({
      rating,
      comment,
      companyId,
      userId: req.user?._id, // If user is authenticated
      userName: req.user?.name || 'Anonymous'
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating feedback',
      error: error.message
    });
  }
};

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { companyId, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (companyId) query.companyId = companyId;
    if (status) query.status = status;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name')
      .populate('companyId', 'name');

    // Get total count for pagination
    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalResults: total
      }
    });

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks',
      error: error.message
    });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    const { companyId } = req.query;

    const query = companyId ? { companyId } : {};

    const stats = await Feedback.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ['$averageRating', 1] },
          totalFeedbacks: 1,
          ratingDistribution: {
            5: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 5] } } } },
            4: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 4] } } } },
            3: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 3] } } } },
            2: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 2] } } } },
            1: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 1] } } } }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        averageRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    });

  } catch (error) {
    console.error('Error getting feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting feedback statistics',
      error: error.message
    });
  }
};

// Update feedback status (for admin/company)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feedback status',
      error: error.message
    });
  }
};