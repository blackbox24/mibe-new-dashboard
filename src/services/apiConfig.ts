import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

// Cannot use useAuth directly here; we'll handle 401 logout in AuthContext consumers
export const base_url = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travelUserToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer prefix
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travelUser');
      localStorage.removeItem('travelUserToken');
      window.location.reload();
      // Note: Cannot call useAuth().logout() here because hooks can't be used in non-React modules
      // Consumers of the API should handle redirects in components
    }
    return Promise.reject(error);
  }
);