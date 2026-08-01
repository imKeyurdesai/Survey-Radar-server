const crypto = require('crypto');
const surveyRepository = require('../repositories/surveyRepository');

class SurveyService {
  async processSurveyReport(provider, title, reward, estimatedTime, surveyId, projectId) {
    // Generate deduplication hash
    const hashInput = `${projectId}-${provider}-${surveyId || title}-${reward || ''}-${estimatedTime || ''}`;
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

    const survey = await surveyRepository.insertUnique({
      provider,
      title,
      reward,
      estimatedTime,
      surveyId,
      hash,
      projectId
    });

    if (survey) {
      // It's a new survey, trigger notification
      const notificationService = require('./notificationService');
      notificationService.sendSurveyAlert(projectId, survey).catch(console.error);
      return { isNew: true, survey };
    } else {
      // It was a duplicate
      return { isNew: false, survey: null };
    }
  }

  async getRecentSurveys(projectId) {
    return await surveyRepository.getRecent(projectId);
  }
}

module.exports = new SurveyService();
