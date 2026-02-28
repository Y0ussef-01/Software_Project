import axios from 'axios';
import { getToken } from './storage';
import Constants from 'expo-constants';

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
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;