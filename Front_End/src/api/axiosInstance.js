import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development';

const axiosInstance = axios.create({
    baseURL: isDevelopment
        ? "http://localhost:5000"
        : "https://software-project-5413.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

export default axiosInstance;