const express = require('express');
const { registerWorker, heartbeat, getWorkerStatus } = require('../controllers/workerController');
const { protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.use(protect); // Require auth for all worker routes

router.post(
  '/register',
  [
    check('workerId', 'Worker ID is required').not().isEmpty(),
    check('projectId', 'Project ID is required').not().isEmpty()
  ],
  registerWorker
);

router.post('/heartbeat', heartbeat);

router.get('/status/:projectId', getWorkerStatus);

module.exports = router;
