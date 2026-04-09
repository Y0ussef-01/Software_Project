import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import API from './axiosConfig';
import { getRole } from './storage';

export const registerPushToken = async () => {
    try {
        if (!Device.isDevice) return;

        // 1. طلب الصلاحيات
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;

        // 2. الحصول على التوكن
        const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
        const pushToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

        const role = await getRole();
        if (!role) return;

        /**
         * الخطوة الذهبية:
         * هنبعت طلب "تنظيف" للسيرفر يمسح التوكن ده من أي جدول (طلاب أو مدرسين) 
         * قبل ما نربطه بالحساب الحالي.
         **/
        try {
            await API.post('/auth/clear-token-globally', { pushToken });
        } catch (e) {
            // لو الـ endpoint مش موجودة لسه، السيرفر هيحدث التوكن أوتوماتيك مع الـ put الجاية
            console.log("Global clear skip");
        }

        // 3. ربط التوكن بالحساب الحالي "فقط"
        await API.put(`/${role}/registerToken`, { pushToken });
        console.log('✅ Token linked to current account only');

    } catch (err) {
        console.log('Push error:', err);
    }
};

export const unregisterPushToken = async (role: string | null) => {
    const userRole = role || await getRole();
    if (!userRole) return;
    try {
        // مسح التوكن عند الخروج عشان نضمن إن الإشعارات تقف
        await API.put(`/${userRole}/registerToken`, { pushToken: null });
    } catch (e) {
        console.log('Unregister error');
    }
};