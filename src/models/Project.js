const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name']
  },
  joinCode: {
    type: String,
    required: [true, 'Join code is required'],
    unique: true
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
