import { useEffect } from 'react';
import { Stack, router } from "expo-router";
import { I18nManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getToken, getRole } from '../api/storage';

// استيراد الـ APIs الخاصة بك
import { getStudentProfile } from '../api/studentApi';
import { getTeacherProfile } from '../api/teacherApi';

/**
 * 1. إعداد معالج النوتيفيكيشن (خارج الـ Component)
 * ده أهم جزء عشان النوتيفيكيشن "اللي من بره" تشتغل والموبايل مقفول
 * بدون أي اعتماد على الـ AsyncStorage أو الكاش.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// إلغاء الـ RTL لضمان ثبات التصميم
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

export default function RootLayout() {
    useEffect(() => {
        /**
         * 2. مستمعات النوتيفيكيشن (تشتغل فوراً وبشكل مستقل)
         */
        // مستمع للاستقبال والتطبيق مفتوح أو في الخلفية
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log("🔔 Notification Received (Direct System Path)");
        });

        // مستمع للتعامل مع "الضغط" على الإشعار والموبايل مقفول
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("📩 User opened notification from background/quit state");
            // هنا النظام القديم: الإشعار بيفتح التطبيق مباشرة
        });

        /**
         * 3. نظام التوجيه (هنا فقط نستخدم الكاش)
         */
        const checkAuthAndNavigate = async () => {
            try {
                const token = await getToken();
                const role = await getRole();

                if (token && role) {
                    // جلب بيانات البروفايل (فريش)
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

        // تنظيف المستمعات عند قفل الصفحة
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