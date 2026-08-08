const { Expo } = require('expo-server-sdk');
const DeviceToken = require('../models/DeviceToken');
const Project = require('../models/Project');
const User = require('../models/User');

let expo = new Expo();

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
      const soundMap = {};
      users.forEach(u => {
        soundMap[u._id.toString()] = u.notificationSound || 'default';
      });

      const tokens = await DeviceToken.find({ userId: { $in: userIds } });
      
      if (tokens.length === 0) return;
      
      let messages = [];
      for (let deviceToken of tokens) {
        if (!Expo.isExpoPushToken(deviceToken.token)) {
          console.error(`Push token ${deviceToken.token} is not a valid Expo push token`);
          continue;
        }

        const userSound = soundMap[deviceToken.userId.toString()] || 'default';
        
        // Android: channelId must match the channel registered on the device
        // "default" -> channel "default", custom -> channel "sound-<resourceName>"
        const channelId = userSound === 'default' ? 'default' : `sound-${userSound}`;
        
        // iOS: sound field is the filename. For custom sounds bundled via expo-notifications plugin,
        // pass the resource name. "default" uses the system default sound.
        const iosSound = userSound === 'default' ? 'default' : `${userSound}.wav`;

        messages.push({
          to: deviceToken.token,
          sound: iosSound,
          channelId: channelId,
          title: '🔥 New Survey Available!',
          body: `Reward: ${survey.reward}$ - (${survey.estimatedTime})`,
          data: { surveyId: survey.surveyId, projectId: projectId },
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
