import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import API from './axiosConfig';
import { getToken, getRole } from './storage';

export const registerPushToken = async () => {
    try {
        if (!Device.isDevice) return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return;

        const token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId
        })).data;

        const userToken = await getToken();
        if (!userToken) return;

        const role = await getRole();
        const endpoint = role === 'teacher' ? '/teacher/registerToken' : '/student/registerToken';
        await API.put(endpoint, { pushToken: token });

    } catch (err) {
        console.log('Push token error:', err);
    }
};