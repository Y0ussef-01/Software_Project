import API from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let memoizedTeacherProfile: any = null;

const TEACHER_CACHE_KEY = 'teacher_profile_cache';

export const getTeacherProfile = async () => {
    try {
        if (memoizedTeacherProfile) {
            fetchAndSaveTeacherProfile().catch(() => {}); 
            return memoizedTeacherProfile;
        }

        const localData = await AsyncStorage.getItem(TEACHER_CACHE_KEY);
        if (localData) {
            memoizedTeacherProfile = JSON.parse(localData);
            fetchAndSaveTeacherProfile().catch(() => {});
            return memoizedTeacherProfile;
        }

        return await fetchAndSaveTeacherProfile();

    } catch (error) {
        console.error("Teacher Profile Error:", error);
        throw error;
    }
};


const fetchAndSaveTeacherProfile = async () => {
    try {
        const response = await API.get('/teacher/profile');
        const data = response.data;

        memoizedTeacherProfile = data;
        await AsyncStorage.setItem(TEACHER_CACHE_KEY, JSON.stringify(data));
        
        return data;
    } catch (err) {
        if (memoizedTeacherProfile) return memoizedTeacherProfile;
        throw err;
    }
};

export const clearTeacherCache = async () => {
    memoizedTeacherProfile = null;
    await AsyncStorage.removeItem(TEACHER_CACHE_KEY);
};