import API from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const clearProfileCache = async () => {
    memoizedProfile = null;
    await AsyncStorage.removeItem(CACHE_KEY);
};