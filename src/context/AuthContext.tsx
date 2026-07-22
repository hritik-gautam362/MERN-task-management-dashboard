import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ToastMessage } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', text: string) => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'task_app_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
        } catch (err) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.login(email, password);
      setUser(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      addToast('success', `Welcome back, ${data.name}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      addToast('error', msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.register(name, email, password);
      setUser(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      addToast('success', `Account created successfully! Welcome, ${data.name}.`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      addToast('error', msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    addToast('info', 'Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
