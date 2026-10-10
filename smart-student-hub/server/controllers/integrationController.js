const axios = require('axios');
const User = require('../models/User');
const Activity = require('../models/Activity');

/**
 * @desc    Get supported integration providers
 * @route   GET /api/integration/providers
 * @access  Private (Admin/Faculty)
 */
exports.getProviders = async (req, res, next) => {
  try {
    const supportedProviders = [
      {
        name: 'LMS Connector',
        key: 'lms',
        description: 'Sync student achievements, attendance, and certificates with learning management systems.',
      },
      {
        name: 'ERP Connector',
        key: 'erp',
        description: 'Export student profile and accreditation-ready reports for ERP and administrative systems.',
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        supportedProviders,
        message: 'Integration support is ready for future LMS/ERP connectors.',
      },
    });
  } catch (error) {
    next(error);
  }
};

const buildStudentExport = async (studentId, includeAllActivities = false) => {
  const student = await User.findById(studentId).select('-password');
  if (!student || student.role !== 'student') {
    return null;
  }

  const activityFilter = { studentId: student._id };
  if (!includeAllActivities) {
    activityFilter.status = 'approved';
  }

  const activities = await Activity.find(activityFilter).sort({ date: -1 });

  const Project = require('../models/Project');
  const projects = await Project.find({ createdBy: student._id, isPublished: true }).sort({ createdAt: -1 });

  const approvedCount = await Activity.countDocuments({ studentId: student._id, status: 'approved' });
  const pendingCount = await Activity.countDocuments({ studentId: student._id, status: { $in: ['pending', 'faculty_approved'] } });

  return {
    profile: {
      id: student._id,
      name: student.name,
      email: student.email,
      bio: student.bio,
      role: student.role,
      points: student.points,
      skills: student.skills,
      socialLinks: student.socialLinks,
      portfolioId: student.portfolioId,
      isPublic: student.isPublic,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    },
    stats: {
      approvedActivities: approvedCount,
      pendingActivities: pendingCount,
      totalActivities: approvedCount + pendingCount,
    },
    activities: activities.map((activity) => ({
      id: activity._id,
      title: activity.title,
      type: activity.type,
      date: activity.date,
      description: activity.description,
      status: activity.status,
      points: activity.points,
      certificate: activity.certificate,
      approvedBy: activity.approvedBy,
    })),
    projects: projects.map((project) => ({
      id: project._id,
      title: project.title,
      description: project.description,
      problem: project.problem,
      solution: project.solution,
      techStack: project.techStack,
      features: project.features,
      githubLink: project.githubLink,
      liveLink: project.liveLink,
      workflow: project.workflow,
      challenges: project.challenges,
      futureImprovements: project.futureImprovements,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })),
  };
};

/**
 * @desc    Export student data in LMS/ERP friendly format
 * @route   GET /api/integration/export/student/:studentId
 * @access  Private (Admin/Faculty)
 */
exports.exportStudentData = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { includeAllActivities } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (req.user.role === 'faculty' && student.supervisor?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to export this student data' });
    }

    const payload = await buildStudentExport(studentId, includeAllActivities === 'true');
    if (!payload) {
      return res.status(404).json({ success: false, message: 'Failed to build student export data' });
    }

    res.status(200).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Push student data to external LMS or ERP system
 * @route   POST /api/integration/push
 * @access  Private (Admin/Faculty)
 */
exports.pushToProvider = async (req, res, next) => {
  try {
    const { provider, studentId, targetUrl, apiKey, includeAllActivities = false } = req.body;

    if (!provider || !studentId || !targetUrl) {
      return res.status(400).json({ success: false, message: 'provider, studentId and targetUrl are required' });
    }

    if (!['lms', 'erp'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Unsupported provider type' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (req.user.role === 'faculty' && student.supervisor?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to push this student data' });
    }

    const payload = await buildStudentExport(studentId, includeAllActivities);
    const headers = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await axios.post(targetUrl, payload, { headers, timeout: 15000 });

    res.status(200).json({
      success: true,
      data: {
        provider,
        targetUrl,
        status: response.status,
        statusText: response.statusText,
        responseData: response.data,
      },
    });
  } catch (error) {
    const message = error.response?.data || error.message || 'External push failed';
    res.status(error.response?.status || 500).json({ success: false, message });
  }
};
