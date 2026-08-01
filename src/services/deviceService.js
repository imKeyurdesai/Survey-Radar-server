const deviceRepository = require('../repositories/deviceRepository');

class DeviceService {
  async registerDeviceToken(userId, token, platform) {
    return await deviceRepository.registerToken(userId, token, platform);
  }

  async getNotificationHistory(userId) {
    return await deviceRepository.getHistory(userId);
  }
}

module.exports = new DeviceService();
