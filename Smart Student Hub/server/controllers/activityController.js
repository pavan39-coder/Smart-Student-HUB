const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { deleteCertificate, uploadCertificate } = require('../utils/fileStorage');

/**
 * @desc    Add activity
 * @route   POST /api/activity/add
 * @access  Private (Student)
 */
exports.addActivity = async (req, res, next) => {
  let uploadedCertificate;
  try {
    const { title, type, date, description } = req.body;

    // Validate required fields
    if (!title || !type || !date || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const activityData = {
      studentId: req.user.id,
      title,
      type,
      date,
      description,
    };

    // Add certificate if uploaded
    if (req.file) {
      uploadedCertificate = await uploadCertificate(req.file);
      activityData.certificate = {
        originalName: req.file.originalname,
        ...uploadedCertificate,
        uploadDate: new Date(),
      };
    }

    const activity = await Activity.create(activityData);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    if (uploadedCertificate) {
      try {
        await deleteCertificate(uploadedCertificate.filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded certificate:', cleanupError);
      }
    }
    next(error);
  }
};

/**
 * @desc    Get my activities
 * @route   GET /api/activity/my
 * @access  Private (Student)
 */
exports.getMyActivities = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = { studentId: req.user.id };

    if (status) filter.status = status;
    if (type) filter.type = type;

    const activities = await Activity.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single activity
 * @route   GET /api/activity/:id
 * @access  Private
 */
exports.getActivity = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(req.params.id).populate('studentId approvedBy');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check if user is owner or admin
    if (
      activity.studentId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this activity',
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update activity
 * @route   PUT /api/activity/:id
 * @access  Private (Student - only pending)
 */
exports.updateActivity = async (req, res, next) => {
  let uploadedCertificate;
  let previousCertificatePath;
  let activitySaved = false;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID format' });
    }

    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Only owner can update
    if (activity.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this activity',
      });
    }

    // Can only update pending activities
    if (activity.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only update pending activities',
      });
    }

    const { title, type, date, description } = req.body;

    if (title) activity.title = title;
    if (type) activity.type = type;
    if (date) activity.date = date;
    if (description) activity.description = description;

    // Handle new certificate
    if (req.file) {
      previousCertificatePath = activity.certificate?.filePath;
      uploadedCertificate = await uploadCertificate(req.file);
      activity.certificate = {
        originalName: req.file.originalname,
        ...uploadedCertificate,
        uploadDate: new Date(),
      };
    }

    await activity.save();
    activitySaved = true;

    if (previousCertificatePath) {
      try {
        await deleteCertificate(previousCertificatePath);
      } catch (cleanupError) {
        console.error('Error deleting replaced certificate:', cleanupError);
      }
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    if (uploadedCertificate && !activitySaved) {
      try {
        await deleteCertificate(uploadedCertificate.filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded certificate:', cleanupError);
      }
    }
    next(error);
  }
};

/**
 * @desc    Delete activity
 * @route   DELETE /api/activity/:id
 * @access  Private (Student - only pending)
 */
exports.deleteActivity = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Only owner can delete
    if (activity.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity',
      });
    }

    // Can only delete pending activities
    if (activity.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending activities',
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    let cleanupWarning;
    if (activity.certificate && activity.certificate.filePath) {
      try {
        await deleteCertificate(activity.certificate.filePath);
      } catch (error) {
        console.error('Error deleting activity certificate:', error);
        cleanupWarning = 'Activity was deleted, but its certificate could not be removed.';
      }
    }

    res.status(200).json({
      success: true,
      message: cleanupWarning || 'Activity deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
