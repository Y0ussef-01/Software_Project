import { useEffect } from 'react';
import { Stack, router } from "expo-router";
import { I18nManager, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getToken, getRole } from '../api/storage';
import { registerPushToken } from '../api/notifications';

import { getStudentProfile } from '../api/studentApi';
import { getTeacherProfile } from '../api/teacherApi';


if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: true,
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export default function RootLayout() {
    useEffect(() => {
        registerPushToken();

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log("🔔 Notification Received");
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("📩 User opened notification from background/quit state");
        });

        const checkAuthAndNavigate = async () => {
            try {
                const token = await getToken();
                const role = await getRole();

                if (token && role) {
                    if (role === 'student') {
                        getStudentProfile().catch(() => {});
                        router.replace('/home' as any);
                    } else if (role === 'teacher') {
                        getTeacherProfile().catch(() => {});
                        router.replace('/hometeacher' as any);
                    }
                }
            } catch (e) {
                console.error("Auth check failed");
            }
        };

        checkAuthAndNavigate();

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };

    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="hometeacher" options={{ headerShown: false }} />
            <Stack.Screen name="studentschedule" options={{ headerShown: false }} />
        </Stack>
    );
}