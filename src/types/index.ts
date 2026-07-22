export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
  createdAt?: string;
}

export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
  _id: string;
  user?: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
