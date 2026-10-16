const { Expo } = require('expo-server-sdk');
const DeviceToken = require('../models/DeviceToken');
const Project = require('../models/Project');
const User = require('../models/User');

let expo = new Expo();

function calculateSurveyRatio(rewardStr, timeStr) {
  if (!rewardStr || !timeStr) return 0;

  let rewardValue = 0;
  const rewardMatch = rewardStr.match(/[\d.]+/);
  if (rewardMatch) rewardValue = parseFloat(rewardMatch[0]);

  let cents = 0;
  if (rewardStr.includes('$') || rewardStr.includes('£') || rewardStr.includes('€') || rewardStr.includes('.')) {
    cents = rewardValue * 100;
  } else {
    cents = rewardValue;
  }

  const timeMatch = timeStr.match(/\d+/);
  if (!timeMatch) return 0;
  const minutes = parseInt(timeMatch[0], 10);

  if (minutes === 0) return 0;

  return cents / minutes;
}

class NotificationService {
  async sendSurveyAlert(projectId, survey) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        console.warn('Project not found for notification:', projectId);
        return;
      }
      
      const userIds = [project.ownerId, ...project.members];
      
      const users = await User.find({ _id: { $in: userIds } });
      const userPrefMap = {};
      users.forEach(u => {
        userPrefMap[u._id.toString()] = {
          sound: u.notificationSound || 'default',
          minPriority: u.minNotificationPriority || 'all'
        };
      });

      const tokens = await DeviceToken.find({ userId: { $in: userIds } });
      
      if (tokens.length === 0) return;

      const ratio = calculateSurveyRatio(survey.reward, survey.estimatedTime);
      const isHigh = ratio > 2.5;
      const isMedium = ratio >= 1.5;
      const priorityLabel = isHigh ? 'high' : (isMedium ? 'medium' : 'low');
      
      let messages = [];
      for (let deviceToken of tokens) {
        if (!Expo.isExpoPushToken(deviceToken.token)) {
          console.error(`Push token ${deviceToken.token} is not a valid Expo push token`);
          continue;
        }

        const userPref = userPrefMap[deviceToken.userId.toString()] || { sound: 'default', minPriority: 'all' };
        const minPriority = userPref.minPriority || 'all';

        // Filter based on user's notification priority setting
        if (minPriority === 'none') {
          continue;
        }
        if (minPriority === 'high' && !isHigh) {
          continue;
        }
        if (minPriority === 'medium' && !isMedium) {
          continue;
        }

        const userSound = userPref.sound;
        
        // Android: channelId must match the channel registered on the device
        // "default" -> channel "default", custom -> channel "sound-<resourceName>"
        const channelId = userSound === 'default' ? 'default' : `sound-${userSound}`;
        
        // iOS: sound field is the filename. For custom sounds bundled via expo-notifications plugin,
        // pass the resource name. "default" uses the system default sound.
        const iosSound = userSound === 'default' ? 'default' : `${userSound}.wav`;

        let title = '🔥 New Survey Available!';
        if (isHigh) {
          title = '🔥 High Priority Survey! (> 2.5)';
        } else if (isMedium) {
          title = '⚡ Medium Priority Survey (≥ 1.5)';
        }

        messages.push({
          to: deviceToken.token,
          sound: iosSound,
          channelId: channelId,
          title: title,
          body: `Reward: ${survey.reward}$ - (${survey.estimatedTime})`,
          data: { 
            surveyId: survey.surveyId, 
            projectId: projectId,
            priority: priorityLabel,
            ratio: Number(ratio.toFixed(2))
          },
        });
      }

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending chunk:', error);
        }
      }
    } catch (err) {
      console.error('Error in NotificationService:', err);
    }
  }
}

module.exports = new NotificationService();
