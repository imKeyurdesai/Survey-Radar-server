const surveyService = require('../services/surveyService');
const { validationResult } = require('express-validator');

exports.reportSurvey = async (req, res, next) => {
  try {
    const projectIdParam = req.params.projectId; // This is actually the joinCode
    const { surveys } = req.body;
    
    if (!surveys || !Array.isArray(surveys)) {
      return res.status(400).json({ success: false, error: 'Surveys array is required' });
    }

    const Project = require('../models/Project');
    let project = await Project.findOne({ joinCode: projectIdParam });
    if (!project && projectIdParam.length === 24) {
      project = await Project.findById(projectIdParam);
    }
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const projectId = project._id;

    const results = [];
    for (const s of surveys) {
      const result = await surveyService.processSurveyReport(
        s.provider,
        s.title,
        s.reward,
        s.estimatedTime,
        s.surveyId,
        projectId
      );
      results.push(result);
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getRecentSurveys = async (req, res, next) => {
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

    const surveys = await surveyService.getRecentSurveys(project._id);
    res.status(200).json({ success: true, data: surveys });
  } catch (error) {
    next(error);
  }
};
