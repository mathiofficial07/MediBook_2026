const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  user: {
    type: String, // Can be name or email for quick display
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'appointment', 'doctor', 'system'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
