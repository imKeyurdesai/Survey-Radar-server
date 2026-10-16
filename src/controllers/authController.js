const authService = require('../services/authService');
const { validationResult } = require('express-validator');

exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const userData = await authService.register(name, email, password);
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(400);
    }
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const userData = await authService.login(email, password);
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      res.status(401);
    }
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, notificationSound, minNotificationPriority } = req.body;
    const userData = await authService.updateProfile(req.user.id, name, email, notificationSound, minNotificationPriority);
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    if (error.message === 'Email already in use') {
      res.status(400);
    }
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await authService.deleteAccount(req.user.id);
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
