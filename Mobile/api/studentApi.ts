import API from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// Student Profile Cache
// ============================================
let memoizedProfile: any = null;
const CACHE_KEY = 'student_profile_cache';

export const getStudentProfile = async () => {
    try {
        if (memoizedProfile) {
            fetchAndSaveProfile();
            return memoizedProfile;
        }

        const localData = await AsyncStorage.getItem(CACHE_KEY);
        if (localData) {
            memoizedProfile = JSON.parse(localData);
            fetchAndSaveProfile();
            return memoizedProfile;
        }

        return await fetchAndSaveProfile();

    } catch (error) {
        console.error("Profile Error:", error);
        throw error;
    }
};

const fetchAndSaveProfile = async () => {
    try {
        const response = await API.get('/student/Profile');
        const data = response.data;
        memoizedProfile = data;
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return data;
    } catch (err) {
        if (memoizedProfile) return memoizedProfile;
        throw err;
    }
};

// ============================================
// Course Analytics Cache (للـ AI Performance)
// ============================================
let memoizedAnalytics: Record<string, any> = {};
const ANALYTICS_CACHE_PREFIX = 'student_analytics_';

export const getCourseAnalytics = async (courseId: string) => {
    try {
        // 1. لو في Memory رجعها فوراً وحدّث في الخلفية
        if (memoizedAnalytics[courseId]) {
            fetchAndSaveAnalytics(courseId);
            return memoizedAnalytics[courseId];
        }

        // 2. لو في AsyncStorage
        const localData = await AsyncStorage.getItem(`${ANALYTICS_CACHE_PREFIX}${courseId}`);
        if (localData) {
            memoizedAnalytics[courseId] = JSON.parse(localData);
            fetchAndSaveAnalytics(courseId);
            return memoizedAnalytics[courseId];
        }

        // 3. أول مرة - جيب من الـ API
        return await fetchAndSaveAnalytics(courseId);

    } catch (error) {
        console.error("Analytics Error:", error);
        throw error;
    }
};

const fetchAndSaveAnalytics = async (courseId: string) => {
    try {
        const response = await API.get(`/student/analytics/${courseId}`);
        const data = response.data;
        memoizedAnalytics[courseId] = data;
        await AsyncStorage.setItem(`${ANALYTICS_CACHE_PREFIX}${courseId}`, JSON.stringify(data));
        return data;
    } catch (err) {
        if (memoizedAnalytics[courseId]) return memoizedAnalytics[courseId];
        throw err;
    }
};

// ============================================
// Clear Functions
// ============================================

// امسح كل حاجة (profile + analytics) - تستخدم عند الـ logout
export const clearProfileCache = async () => {
    memoizedProfile = null;
    memoizedAnalytics = {};
    await AsyncStorage.removeItem(CACHE_KEY);
    const keys = await AsyncStorage.getAllKeys();
    const analyticsKeys = keys.filter(k => k.startsWith(ANALYTICS_CACHE_PREFIX));
    if (analyticsKeys.length > 0) {
        await AsyncStorage.multiRemove(analyticsKeys);
    }
};

// امسح analytics مادة معينة بس
export const clearCourseAnalyticsCache = async (courseId: string) => {
    delete memoizedAnalytics[courseId];
    await AsyncStorage.removeItem(`${ANALYTICS_CACHE_PREFIX}${courseId}`);
};