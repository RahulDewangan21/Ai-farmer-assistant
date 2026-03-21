import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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

export const aiChat = (message) =>
  api.post('/ai/chat', { message });

export const aiImageAnalysis = (image, mimeType) =>
  api.post('/ai/image', { image, mimeType });

export const getHistory = (params) =>
  api.get('/history', { params });

export const deleteHistoryItem = (id) =>
  api.delete(`/history/${id}`);

export const clearAllHistory = () =>
  api.delete('/history/clear');

export const getWeather = (city) =>
  api.get(`/weather/${city}`);

export const getWeatherAdvice = (city) =>
  api.post('/weather/advice', { city });

export default api;
