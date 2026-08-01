const express = require('express');
const { reportSurvey, getRecentSurveys } = require('../controllers/surveyController');
const { workerAuth, protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.post(
  '/:projectId/report',
  workerAuth,
  reportSurvey
);

// Protected route for users to view recent surveys in a project
router.get('/recent/:projectId', protect, getRecentSurveys);

module.exports = router;
