import api from './api';
import { Task, TaskFormData } from '../types';

export const taskService = {
  getTasks: async (params?: { search?: string; status?: string; priority?: string }): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>('/api/tasks', { params });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const response = await api.get<Task[]>('/tasks', { params });
        return response.data;
      }
      throw err;
    }
  },

  createTask: async (taskData: TaskFormData): Promise<Task> => {
    try {
      const response = await api.post<Task>('/api/tasks', taskData);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const response = await api.post<Task>('/tasks', taskData);
        return response.data;
      }
      throw err;
    }
  },

  updateTask: async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    try {
      const response = await api.put<Task>(`/api/tasks/${id}`, taskData);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const response = await api.put<Task>(`/tasks/${id}`, taskData);
        return response.data;
      }
      throw err;
    }
  },

  deleteTask: async (id: string): Promise<{ message: string; id: string }> => {
    try {
      const response = await api.delete<{ message: string; id: string }>(`/api/tasks/${id}`);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        const response = await api.delete<{ message: string; id: string }>(`/tasks/${id}`);
        return response.data;
      }
      throw err;
    }
  },
};
