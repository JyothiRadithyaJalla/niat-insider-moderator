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
  
  // Smarter safeguard: Prepend /api ONLY if it is missing from BOTH the baseURL and the request URL
  const hasBaseApi = config.baseURL?.includes('/api');
  const hasRequestApi = config.url?.startsWith('/api') || config.url?.startsWith('api');
  
  if (config.url && !config.url.startsWith('http') && !hasBaseApi && !hasRequestApi) {
     const cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
     console.warn(`[API Debug] Prepending missing /api to: ${cleanUrl}`);
     config.url = `/api${cleanUrl}`;
  }

  return config;
});

export default api;
