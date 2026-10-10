const mongoose = require('mongoose');

/**
 * Activity Schema
 * Stores student activities with certificate uploads
 */
const activitySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide activity title'],
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: [
        'conference',
        'seminar',
        'workshop',
        'competition',
        'certification',
        'project',
        'internship',
        'leadership',
        'volunteering',
        'community_service',
        'publication',
        'club_activity',
        'other',
      ],
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide activity date'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: 2000,
    },
    certificate: {
      originalName: String,
      fileName: String,
      filePath: String,
      uploadDate: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'faculty_approved', 'approved', 'rejected'],
      default: 'pending',
    },
    points: {
      type: Number,
      default: 0,
    },
    rejectionReason: String,
    adminNotes: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index for efficient queries
activitySchema.index({ studentId: 1, status: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
