import axios from 'axios';
import { getToken } from './storage';
import Constants from 'expo-constants';


const { debuggerHost } = Constants.expoConfig?.hostUri
  ? { debuggerHost: Constants.expoConfig.hostUri.split(':').shift() }
  : { debuggerHost: 'localhost' };

const API = axios.create({
  baseURL: `https://software-project-5413.onrender.com`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(async (config) => {
  
  if (config.url?.includes('/login')) {
    delete config.headers.Authorization;
    return config;
  }

  
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;