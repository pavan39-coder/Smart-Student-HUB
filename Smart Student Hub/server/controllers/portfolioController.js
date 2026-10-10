const User = require('../models/User');
const Activity = require('../models/Activity');
const PDFDocument = require('pdfkit');

/**
 * @desc    Get portfolio by ID
 * @route   GET /api/portfolio/:portfolioId
 * @access  Public
 */
exports.getPortfolio = async (req, res, next) => {
  try {
    const user = await User.findOne({ portfolioId: req.params.portfolioId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found',
      });
    }

    if (!user.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'This portfolio is private',
      });
    }

    // Get user's approved activities
    const activities = await Activity.find({
      studentId: user._id,
      status: 'approved',
    }).sort({ date: -1 });

    // Get user's projects
    const Project = require('../models/Project');
    const projects = await Project.find({
      createdBy: user._id,
      isPublished: true,
    }).sort({ createdAt: -1 });

    const portfolioData = {
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        points: user.points,
        skills: user.skills,
        socialLinks: user.socialLinks,
      },
      activities,
      projects,
    };

    res.status(200).json({
      success: true,
      data: portfolioData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download portfolio as PDF
 * @route   GET /api/portfolio/pdf/:portfolioId
 * @access  Public
 */
exports.getPortfolioPDF = async (req, res, next) => {
  try {
    const user = await User.findOne({ portfolioId: req.params.portfolioId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found',
      });
    }

    if (!user.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'This portfolio is private',
      });
    }

    const activities = await Activity.find({
      studentId: user._id,
      status: 'approved',
    }).sort({ date: -1 });

    const Project = require('../models/Project');
    const projects = await Project.find({
      createdBy: user._id,
      isPublished: true,
    }).sort({ createdAt: -1 });

    const filename = `${user.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    doc.fontSize(22).text(`${user.name} - Verified Portfolio`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).fillColor('#333');

    if (user.bio) {
      doc.fontSize(12).text(`Bio: ${user.bio}`);
      doc.moveDown();
    }

    const socials = [];
    if (user.socialLinks?.github) socials.push(`GitHub: ${user.socialLinks.github}`);
    if (user.socialLinks?.linkedin) socials.push(`LinkedIn: ${user.socialLinks.linkedin}`);
    if (user.socialLinks?.portfolio) socials.push(`Portfolio: ${user.socialLinks.portfolio}`);
    if (socials.length) {
      socials.forEach((item) => doc.text(item));
      doc.moveDown();
    }

    doc.text(`Total Points: ${user.points}`);
    doc.text(`Public Portfolio Link: ${req.protocol}://${req.get('host')}/portfolio/${user.portfolioId}`);
    doc.moveDown();

    if (user.skills && user.skills.length > 0) {
      doc.fontSize(14).text('Skills', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(user.skills.join(', '));
      doc.moveDown();
    }

    if (activities.length > 0) {
      doc.fontSize(14).text('Approved Activities', { underline: true });
      doc.moveDown(0.5);
      activities.forEach((activity, index) => {
        doc.fontSize(12).text(`${index + 1}. ${activity.title} (${activity.type})`, { continued: true });
        doc.text(` - ${activity.date.toISOString().split('T')[0]}`);
        doc.text(`   Points: ${activity.points || 0}`);
        if (activity.description) {
          doc.text(`   ${activity.description}`);
        }
        doc.moveDown(0.5);
      });
    }

    if (projects.length > 0) {
      doc.addPage();
      doc.fontSize(14).text('Published Projects', { underline: true });
      doc.moveDown(0.5);
      projects.forEach((project, index) => {
        doc.fontSize(12).text(`${index + 1}. ${project.title}`);
        if (project.description) doc.text(`   ${project.description}`);
        if (project.githubLink) doc.text(`   GitHub: ${project.githubLink}`);
        if (project.liveLink) doc.text(`   Live: ${project.liveLink}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (error) {
    next(error);
  }
};
