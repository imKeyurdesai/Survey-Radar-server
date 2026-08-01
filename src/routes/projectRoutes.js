const express = require('express');
const { createProject, joinProject, leaveProject, getUserProjects } = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.use(protect); // All project routes require authentication

router.get('/', getUserProjects);

router.post(
  '/create',
  [
    check('name', 'Project name is required').not().isEmpty()
  ],
  createProject
);

router.post(
  '/join',
  [
    check('joinCode', 'Join code is required').not().isEmpty()
  ],
  joinProject
);

router.post('/leave/:projectId', leaveProject);

module.exports = router;
