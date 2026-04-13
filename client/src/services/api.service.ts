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
  
  // Final safeguard: Ensure URL starts with /api/ if baseURL was somehow bypassed (common with leading slashes in hooks)
  if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/api')) {
     const cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
     console.warn(`[API Debug] Auto-prefixing /api to: ${cleanUrl}`);
     config.url = `/api${cleanUrl}`;
  }

  return config;
});

export default api;
