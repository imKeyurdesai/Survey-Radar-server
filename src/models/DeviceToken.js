const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: [true, 'Device token is required'],
    unique: true
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'web']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeviceToken', deviceTokenSchema);
