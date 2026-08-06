const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: [true, 'Worker ID is required'],
    unique: true
  },
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  lastHeartbeat: {
    type: Date,
    default: Date.now
  },
  browser: {
    type: String
  },
  version: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Worker', workerSchema);
