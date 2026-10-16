const mongoose = require('mongoose');

const notificationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  surveyEventId: {
    type: mongoose.Schema.ObjectId,
    ref: 'SurveyEvent',
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed']
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NotificationHistory', notificationHistorySchema);
