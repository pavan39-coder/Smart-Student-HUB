const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const User = require('../models/User');

/**
 * @desc    Approve activity and assign points
 * @route   PUT /api/admin/activity/:id/approve
 * @access  Private (Admin)
 */
exports.approveActivity = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID format' });
    }

    const { points, adminNotes } = req.body;

    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Faculty can only review activities from their assigned students
    if (req.user.role === 'faculty') {
      const student = await User.findById(activity.studentId);
      if (!student || student.supervisor?.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to approve this activity',
        });
      }

      if (activity.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending activities can be faculty-approved',
        });
      }

      activity.status = 'faculty_approved';
      if (points != null && points >= 0) activity.recommendedPoints = points;
      if (adminNotes) activity.facultyNotes = adminNotes;
      activity.approvedBy = req.user.id;

      await activity.save();

      return res.status(200).json({
        success: true,
        message: 'Activity faculty-verified successfully',
        data: { activity },
      });
    }

    // Admin final approval
    if (req.user.role === 'admin') {
      if (points == null || points < 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide valid points',
        });
      }

      if (activity.status === 'rejected') {
        return res.status(400).json({
          success: false,
          message: 'Cannot approve a rejected activity',
        });
      }

      if (activity.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Activity already approved',
        });
      }

      activity.status = 'approved';
      activity.points = points;
      activity.approvedBy = req.user.id;
      if (adminNotes) activity.adminNotes = adminNotes;

      await activity.save();

      // Add points to user
      const user = await User.findByIdAndUpdate(
        activity.studentId,
        { $inc: { points: points } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Activity approved successfully by admin',
        data: { activity, user },
      });
    }

    res.status(403).json({ success: false, message: 'User role not allowed to approve' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject activity
 * @route   PUT /api/admin/activity/:id/reject
 * @access  Private (Admin)
 */
exports.rejectActivity = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID format' });
    }

    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rejection reason',
      });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    if (req.user.role === 'faculty') {
      const student = await User.findById(activity.studentId);
      if (!student || student.supervisor?.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to reject this activity',
        });
      }
      if (activity.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending activities can be rejected by faculty',
        });
      }
    }

    activity.status = 'rejected';
    activity.rejectionReason = rejectionReason;
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Activity rejected',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/admin/students
 * @access  Private (Admin)
 */
exports.getAllStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = { role: 'student' };

    if (req.user.role === 'faculty') {
      filter.supervisor = req.user.id;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(filter).sort({ points: -1 }).populate('supervisor', 'name email');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending activities for approval
 * @route   GET /api/admin/activities/pending
 * @access  Private (Admin)
 */
exports.getPendingActivities = async (req, res, next) => {
  try {
    const statusCondition = req.user.role === 'faculty' ? ['pending'] : ['pending', 'faculty_approved'];

    const query = { status: { $in: statusCondition } };

    if (req.user.role === 'faculty') {
      const students = await User.find({ supervisor: req.user.id }).select('_id');
      const studentIds = students.map((s) => s._id);
      query.studentId = { $in: studentIds.length ? studentIds : [null] };
    }

    const activities = await Activity.find(query)
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

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
 * @desc    Get all faculty users
 * @route   GET /api/admin/faculty
 * @access  Private (Admin)
 */
exports.getAllFaculty = async (req, res, next) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('name email');
    res.status(200).json({ success: true, count: faculty.length, data: faculty });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const studentFilter = { role: 'student' };
    const activityFilter = {};

    if (req.user.role === 'faculty') {
      const students = await User.find({ supervisor: req.user.id }).select('_id');
      const studentIds = students.map((s) => s._id);
      activityFilter.studentId = { $in: studentIds.length ? studentIds : [null] };
    }

    const totalStudents = await User.countDocuments(studentFilter);
    const totalActivities = await Activity.countDocuments(activityFilter);
    const approvedActivities = await Activity.countDocuments({ ...activityFilter, status: 'approved' });
    const pendingActivities = await Activity.countDocuments({ ...activityFilter, status: 'pending' });
    const rejectedActivities = await Activity.countDocuments({ ...activityFilter, status: 'rejected' });

    const topStudents = await User.find(studentFilter)
      .sort({ points: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalActivities,
        approvedActivities,
        pendingActivities,
        rejectedActivities,
        topStudents,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getNAACReport = async (req, res, next) => {
  try {
    const studentFilter = { role: 'student' };
    const activityFilter = {};

    if (req.user.role === 'faculty') {
      const students = await User.find({ supervisor: req.user.id }).select('_id');
      const studentIds = students.map((s) => s._id);
      activityFilter.studentId = { $in: studentIds.length ? studentIds : [null] };
    }

    const totalStudents = await User.countDocuments(studentFilter);
    const totalActivities = await Activity.countDocuments(activityFilter);
    const approvedActivities = await Activity.countDocuments({ ...activityFilter, status: 'approved' });
    const pendingActivities = await Activity.countDocuments({ ...activityFilter, status: 'pending' });
    const rejectedActivities = await Activity.countDocuments({ ...activityFilter, status: 'rejected' });
    const publicPortfolios = await User.countDocuments({ role: 'student', isPublic: true });

    const activityByType = await Activity.aggregate([
      { $match: activityFilter },
      { $group: { _id: '$type', count: { $sum: 1 }, totalPoints: { $sum: '$points' } } },
      { $sort: { count: -1 } },
    ]);

    const activityByStatus = await Activity.aggregate([
      { $match: activityFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const topStudents = await User.find(studentFilter)
      .sort({ points: -1 })
      .limit(10)
      .select('name email points');

    const report = {
      reportType: 'NAAC Accreditation Summary',
      generatedAt: new Date(),
      totalStudents,
      publicPortfolios,
      totalActivities,
      approvedActivities,
      pendingActivities,
      rejectedActivities,
      activityByType,
      activityByStatus,
      topStudents,
    };

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign student to faculty
 * @route   PUT /api/admin/students/:id/assign-faculty
 * @access  Private (Admin)
 */
exports.assignFaculty = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can assign faculty to students',
      });
    }

    const { facultyId } = req.body;
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    if (!facultyId) {
      return res.status(400).json({ success: false, message: 'facultyId is required' });
    }

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(400).json({ success: false, message: 'Invalid faculty ID' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.supervisor = facultyId;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student assigned to faculty successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
