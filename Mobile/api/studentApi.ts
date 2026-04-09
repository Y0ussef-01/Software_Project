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
        if (memoizedAnalytics[courseId]) {
            fetchAndSaveAnalytics(courseId);
            return memoizedAnalytics[courseId];
        }

        const localData = await AsyncStorage.getItem(`${ANALYTICS_CACHE_PREFIX}${courseId}`);
        if (localData) {
            memoizedAnalytics[courseId] = JSON.parse(localData);
            fetchAndSaveAnalytics(courseId);
            return memoizedAnalytics[courseId];
        }

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
// Final Results Cache
// ============================================
let memoizedFinalResults: any = null;
const FINAL_RESULTS_KEY = 'student_final_results_cache';

export const getFinalResults = async () => {
    try {
        if (memoizedFinalResults) {
            fetchAndSaveFinalResults();
            return memoizedFinalResults;
        }

        const localData = await AsyncStorage.getItem(FINAL_RESULTS_KEY);
        if (localData) {
            const parsed = JSON.parse(localData);
            // تحقق من expiresAt أول حاجة
            const firstResult = parsed?.results?.[0];
            if (firstResult?.expiresAt) {
                const isExpired = new Date(firstResult.expiresAt) < new Date();
                if (isExpired) {
                    await AsyncStorage.removeItem(FINAL_RESULTS_KEY);
                    memoizedFinalResults = null;
                    return await fetchAndSaveFinalResults();
                }
            }
            memoizedFinalResults = parsed;
            fetchAndSaveFinalResults();
            return memoizedFinalResults;
        }

        return await fetchAndSaveFinalResults();

    } catch (error) {
        console.error("Final Results Error:", error);
        throw error;
    }
};

const fetchAndSaveFinalResults = async () => {
    try {
        const response = await API.get('/student/final-results');
        const data = response.data;
        memoizedFinalResults = data;
        await AsyncStorage.setItem(FINAL_RESULTS_KEY, JSON.stringify(data));
        return data;
    } catch (err) {
        if (memoizedFinalResults) return memoizedFinalResults;
        throw err;
    }
};

// ============================================
// Clear Functions
// ============================================

export const clearProfileCache = async () => {
    memoizedProfile = null;
    memoizedAnalytics = {};
    memoizedFinalResults = null;
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(FINAL_RESULTS_KEY);
    const keys = await AsyncStorage.getAllKeys();
    const analyticsKeys = keys.filter(k => k.startsWith(ANALYTICS_CACHE_PREFIX));
    if (analyticsKeys.length > 0) {
        await AsyncStorage.multiRemove(analyticsKeys);
    }
};

export const clearCourseAnalyticsCache = async (courseId: string) => {
    delete memoizedAnalytics[courseId];
    await AsyncStorage.removeItem(`${ANALYTICS_CACHE_PREFIX}${courseId}`);
};

export const clearFinalResultsCache = async () => {
    memoizedFinalResults = null;
    await AsyncStorage.removeItem(FINAL_RESULTS_KEY);
};