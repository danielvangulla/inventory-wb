// resources/js/utils/axios.ts
import axios from 'axios';
import { getAuthToken } from './auth';  // Utility to fetch auth token from localStorage

// Extend the Window interface to include Laravel
declare global {
    interface Window {
        Laravel: {
            APP_BACKEND_URL: string;
        };
    }
}

// Access the backendUrl from window.Laravel
const backendUrl = window.Laravel.APP_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: `${backendUrl}/api`,  // This uses the backend URL passed from Laravel
});

// Add token to headers if available
axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
