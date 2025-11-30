import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://uyim24.uz:1300';
const MOCK = import.meta.env.VITE_MOCK === 'true';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export { apiClient, MOCK, API_BASE };
