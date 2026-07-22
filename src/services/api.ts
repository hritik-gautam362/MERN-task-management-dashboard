import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses relative paths, routing to Express server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('task_app_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error('Failed to parse cached user token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
