import { useEffect } from 'react';
import { Stack, router } from "expo-router";
import { I18nManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getToken, getRole } from '../api/storage';

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function RootLayout() {
    useEffect(() => {
        const checkAuth = async () => {
            const token = await getToken();
            const role = await getRole();

            if (token && role) {
                setTimeout(() => {
                    if (role === 'student') {
                        router.replace('/home' as any);
                    } else if (role === 'teacher') {
                        router.replace('/hometeacher' as any);
                    }
                }, 100);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(() => {
            router.push('/notifications' as any);
        });
        return () => subscription.remove();
    }, []);

    return <Stack />;
}