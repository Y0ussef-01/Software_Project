import axios from 'axios';
import { getToken } from './storage';
const API = axios.create({
baseURL: 'http://192.168.1.8:5000',
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