const mongoose = require('mongoose');
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Add project
 * @route   POST /api/project/add
 * @access  Private (Student)
 */
exports.addProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      problem,
      solution,
      techStack,
      features,
      githubLink,
      liveLink,
      workflow,
      challenges,
      futureImprovements,
      screenshots,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    const projectData = {
      title,
      description,
      createdBy: req.user.id,
    };

    if (problem) projectData.problem = problem;
    if (solution) projectData.solution = solution;
    if (techStack) projectData.techStack = JSON.parse(techStack);
    if (features) projectData.features = JSON.parse(features);
    if (githubLink) projectData.githubLink = githubLink;
    if (liveLink) projectData.liveLink = liveLink;
    if (workflow) projectData.workflow = workflow;
    if (challenges) projectData.challenges = challenges;
    if (futureImprovements) projectData.futureImprovements = futureImprovements;
    if (screenshots) projectData.screenshots = JSON.parse(screenshots);

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects
 * @route   GET /api/project
 * @access  Public
 */
exports.getAllProjects = async (req, res, next) => {
  try {
    const { search, limit = 20, skip = 0 } = req.query;

    let filter = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email portfolioId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my projects
 * @route   GET /api/project/my
 * @access  Private
 */
exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/project/:id
 * @access  Public
 */
exports.getProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id).populate(
      'createdBy',
      'name email bio skills socialLinks portfolioId'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!project.isPublished && project.createdBy._id.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Project not available',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/project/:id
 * @access  Private (Owner only)
 */
exports.updateProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID format' });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    const {
      title,
      description,
      problem,
      solution,
      techStack,
      features,
      githubLink,
      liveLink,
      workflow,
      challenges,
      futureImprovements,
      screenshots,
      isPublished,
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (problem) project.problem = problem;
    if (solution) project.solution = solution;
    if (techStack) project.techStack = JSON.parse(techStack);
    if (features) project.features = JSON.parse(features);
    if (githubLink) project.githubLink = githubLink;
    if (liveLink) project.liveLink = liveLink;
    if (workflow) project.workflow = workflow;
    if (challenges) project.challenges = challenges;
    if (futureImprovements) project.futureImprovements = futureImprovements;
    if (screenshots) project.screenshots = JSON.parse(screenshots);
    if (isPublished !== undefined) project.isPublished = isPublished;

    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/project/:id
 * @access  Private (Owner only)
 */
exports.deleteProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get projects by user
 * @route   GET /api/project/user/:userId
 * @access  Public
 */
exports.getProjectsByUser = async (req, res, next) => {
  try {
    const projects = await Project.find({
      createdBy: req.params.userId,
      isPublished: true,
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};
