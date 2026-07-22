import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Try both /api/auth/login and fallback /login
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const response = await api.post<AuthResponse>('/login', { email, password });
        return response.data;
      }
      throw err;
    }
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const response = await api.post<AuthResponse>('/register', { name, email, password });
        return response.data;
      }
      throw err;
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },
};
