const mongoose = require('mongoose');

/**
 * Project Schema
 * Stores student project details with full case study
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please provide project description'],
      maxlength: 3000,
    },
    problem: {
      type: String,
      maxlength: 1000,
    },
    solution: {
      type: String,
      maxlength: 1000,
    },
    techStack: [
      {
        name: String,
        category: String,
      },
    ],
    features: [
      {
        title: String,
        description: String,
      },
    ],
    screenshots: [
      {
        url: String,
        caption: String,
      },
    ],
    githubLink: String,
    liveLink: String,
    workflow: String,
    challenges: String,
    futureImprovements: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
projectSchema.index({ createdBy: 1 });
projectSchema.index({ isPublished: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
