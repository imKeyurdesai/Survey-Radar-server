const projectService = require('../services/projectService');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const project = await projectService.createProject(name, req.user._id);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.joinProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { joinCode } = req.body;
    const project = await projectService.joinProject(joinCode, req.user._id);
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    if (error.message.includes('not found')) res.status(404);
    if (error.message.includes('already a member')) res.status(400);
    next(error);
  }
};

exports.leaveProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await projectService.leaveProject(projectId, req.user._id);
    res.status(200).json({ success: true, message: 'Left project successfully' });
  } catch (error) {
    if (error.message.includes('not found')) res.status(404);
    if (error.message.includes('Owner cannot leave')) res.status(400);
    next(error);
  }
};

exports.getUserProjects = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    // Find projects where user is owner or in members array
    const projects = await Project.find({
      $or: [
        { ownerId: req.user._id },
        { members: req.user._id }
      ]
    });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};
