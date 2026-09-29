import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
export const apiClient = axios.create({
  baseURL: rawApiUrl 
    ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`) 
    : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
