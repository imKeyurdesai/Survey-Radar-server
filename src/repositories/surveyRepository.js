const SurveyEvent = require('../models/SurveyEvent');

class SurveyRepository {
  async insertUnique(surveyData) {
    try {
      // Attempt to insert
      return await SurveyEvent.create(surveyData);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error, means survey already reported
        return null;
      }
      throw error;
    }
  }

  async getRecent(projectId, limit = 50) {
    return await SurveyEvent.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new SurveyRepository();
