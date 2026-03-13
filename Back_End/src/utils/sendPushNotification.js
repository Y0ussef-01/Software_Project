const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const sendPushNotification = async (expoPushTokens, title, body) => {
    if (!expoPushTokens || expoPushTokens.length === 0) return;

    const messages = expoPushTokens
        .filter(token => Expo.isExpoPushToken(token))
        .map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            priority: 'high',
        }));

    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
            console.log('Notifications sent!');
        } catch (err) {
            console.error('Error:', err.message);
        }
    }
};

module.exports = sendPushNotification;