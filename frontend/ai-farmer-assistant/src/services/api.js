import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== API Functions ==========

export const aiChat = (message, language = 'en') =>
  api.post('/ai/chat', { message, language });

export const aiImageAnalysis = (image, mimeType, language = 'en') =>
  api.post('/ai/image', { image, mimeType, language });

export const getHistory = (params) =>
  api.get('/history', { params });

export const deleteHistoryItem = (id) =>
  api.delete(`/history/${id}`);

export const clearAllHistory = () =>
  api.delete('/history/clear');

export const getWeather = (city) =>
  api.get(`/weather/${city}`);

export const getWeatherAdvice = (city, language = 'en') =>
  api.post('/weather/advice', { city, language });

export const getCropAdvisory = (city, language = 'en') =>
  api.post('/weather/crop-advisory', { city, language });

export default api;
