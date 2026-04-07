import { useEffect } from 'react';
import { Stack, router } from "expo-router";
import { I18nManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getToken, getRole } from '../api/storage';

import { getStudentProfile } from '../api/studentApi';
import { getTeacherProfile } from '../api/teacherApi';

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export default function RootLayout() {
    useEffect(() => {
        const checkAuth = async () => {
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
        };
        checkAuth();
    }, []);

   
    return <Stack screenOptions={{ headerShown: false }} />;
}