const mongoose = require('mongoose');

const surveyEventSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: [true, 'Provider name is required']
  },
  title: {
    type: String,
    required: [true, 'Survey title is required']
  },
  reward: {
    type: String
  },
  estimatedTime: {
    type: String
  },
  surveyId: {
    type: String
  },
  hash: {
    type: String,
    required: [true, 'Deduplication hash is required'],
    unique: true
  },
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically delete document after 24 hours (86400 seconds)
  }
});

module.exports = mongoose.model('SurveyEvent', surveyEventSchema);
