const deviceService = require('../services/deviceService');
const { validationResult } = require('express-validator');

exports.registerDevice = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { token, platform } = req.body;
    const deviceToken = await deviceService.registerDeviceToken(req.user._id, token, platform);
    res.status(200).json({ success: true, data: deviceToken });
  } catch (error) {
    next(error);
  }
};

