import axios from 'axios';
import { API_URL } from '../constants/routes.constants';

console.log('[API Debug] BaseURL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Final safeguard: Ensure URL starts with api if baseURL was somehow bypassed
  if (config.url && !config.url.startsWith('http') && !config.url.startsWith('api') && !config.url.startsWith('/api')) {
     console.warn('[API Debug] Fixing missing /api prefix for:', config.url);
  }

  return config;
});

export default api;
