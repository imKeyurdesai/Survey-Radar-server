const deviceRepository = require('../repositories/deviceRepository');

class DeviceService {
  async registerDeviceToken(userId, token, platform) {
    return await deviceRepository.registerToken(userId, token, platform);
  }

}

module.exports = new DeviceService();
