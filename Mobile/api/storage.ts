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
export const saveCache = async (key: string, data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
};


export const getCache = async (key: string) => {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};