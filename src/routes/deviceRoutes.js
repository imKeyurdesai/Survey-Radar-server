const express = require('express');
const { registerDevice } = require('../controllers/deviceController');
const { protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.use(protect); // All device/notification routes require authentication

router.post(
  '/register',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('platform', 'Platform is required').isIn(['ios', 'android', 'web'])
  ],
  registerDevice
);


module.exports = router;
