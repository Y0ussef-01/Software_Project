import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
};


export const saveRole = async (role: string) => {
    await AsyncStorage.setItem('role', role);
};


export const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('token');
};


export const getRole = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('role');
};


export const clearStorage = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
};