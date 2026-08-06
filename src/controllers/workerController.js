const workerService = require('../services/workerService');
const { validationResult } = require('express-validator');

exports.registerWorker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { workerId, projectId: incomingProjectId, name, browser, version } = req.body;
    
    const Project = require('../models/Project');
    let project = await Project.findOne({ joinCode: incomingProjectId });
    if (!project && incomingProjectId.length === 24) {
      project = await Project.findById(incomingProjectId);
    }
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const worker = await workerService.registerWorker(workerId, project._id, name, browser, version);
    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    next(error);
  }
};

exports.heartbeat = async (req, res, next) => {
  try {
    const { workerId, name } = req.body;
    if (!workerId) {
      return res.status(400).json({ success: false, error: 'Worker ID is required' });
    }
    await workerService.processHeartbeat(workerId, name);
    res.status(200).json({ success: true, message: 'Heartbeat received' });
  } catch (error) {
    next(error);
  }
};

exports.getWorkerStatus = async (req, res, next) => {
  try {
    const projectIdParam = req.params.projectId;
    
    const Project = require('../models/Project');
    let project = await Project.findOne({ joinCode: projectIdParam });
    if (!project && projectIdParam.length === 24) {
      project = await Project.findById(projectIdParam);
    }
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const workers = await workerService.getProjectWorkers(project._id);
    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    next(error);
  }
};
