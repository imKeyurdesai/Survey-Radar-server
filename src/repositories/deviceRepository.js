const DeviceToken = require('../models/DeviceToken');

class DeviceRepository {
  async registerToken(userId, token, platform) {
    return await DeviceToken.findOneAndUpdate(
      { token },
      { userId, token, platform },
      { returnDocument: 'after', upsert: true }
    );
  }

}

module.exports = new DeviceRepository();
