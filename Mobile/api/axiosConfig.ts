import axios from 'axios';
import { getToken } from './storage';
import Constants from 'expo-constants';

// الحفاظ على كود تحديد الـ IP عشان يشتغل معاك على الموبايل والـ Emulator
const { debuggerHost } = Constants.expoConfig?.hostUri
  ? { debuggerHost: Constants.expoConfig.hostUri.split(':').shift() }
  : { debuggerHost: 'localhost' };

const API = axios.create({
  baseURL: `http://${debuggerHost}:5000`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(async (config) => {
  // 1. لو الطلب رايح للوجين، بنشيل التوكن القديم خالص عشان ما يعملش تضارب (Conflict)
  // ملحوظة: تأكد إن المسار '/auth/login' مطابق للي عندك في السيرفر
  if (config.url?.includes('/login')) {
    delete config.headers.Authorization;
    return config;
  }

  // 2. لو أي طلب تاني، بنجيب التوكن من الكاش ونحطه عادي
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;