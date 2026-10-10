const User = require('../models/User');
const validators = require('../utils/validators');

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/update
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills, socialLinks } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (socialLinks) updateData.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle portfolio visibility
 * @route   PUT /api/user/portfolio/toggle
 * @access  Private
 */
exports.togglePortfolioVisibility = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.isPublic = !user.isPublic;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Portfolio is now ${user.isPublic ? 'public' : 'private'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/user/stats
 * @access  Private
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const Activity = require('../models/Activity');

    const approvedActivities = await Activity.countDocuments({
      studentId: req.user.id,
      status: 'approved',
    });

    const pendingActivities = await Activity.countDocuments({
      studentId: req.user.id,
      status: { $in: ['pending', 'faculty_approved'] },
    });

    const facultyApproved = await Activity.countDocuments({
      studentId: req.user.id,
      status: 'faculty_approved',
    });

    const user = await User.findById(req.user.id);

    // Get user rank
    const allUsers = await User.find({ role: 'student' }).sort({ points: -1 });
    const rank = allUsers.findIndex((u) => u._id.toString() === req.user.id) + 1;

    res.status(200).json({
      success: true,
      data: {
        points: user.points,
        approvedActivities,
        pendingActivities,
        facultyApproved,
        rank,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
