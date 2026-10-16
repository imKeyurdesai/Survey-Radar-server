const express = require('express');
const { registerUser, loginUser, updateProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

router.put(
  '/profile',
  protect,
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('minNotificationPriority', 'Invalid notification priority').optional().isIn(['all', 'medium', 'high', 'none'])
  ],
  updateProfile
);

router.delete('/profile', protect, deleteAccount);

module.exports = router;
