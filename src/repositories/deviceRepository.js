const DeviceToken = require('../models/DeviceToken');
const NotificationHistory = require('../models/NotificationHistory');

class DeviceRepository {
  async registerToken(userId, token, platform) {
    return await DeviceToken.findOneAndUpdate(
      { token },
      { userId, token, platform },
      { new: true, upsert: true }
    );
  }

  async getHistory(userId, limit = 50) {
    return await NotificationHistory.find({ userId })
      .populate('surveyEventId')
      .sort({ sentAt: -1 })
      .limit(limit);
  }
}

module.exports = new DeviceRepository();
