import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<RegisterData>) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};

// Contacts API
export const contactsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/contacts', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

// Organizations API
export const organizationsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/organizations', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/organizations', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/organizations/${id}`);
    return response.data;
  },
};

// Deals API
export const dealsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/deals', { params });
    return response.data;
  },

  getPipeline: async () => {
    const response = await api.get('/deals/pipeline');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/deals/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/deals', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/deals/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/deals/${id}`);
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/tasks/dashboard');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
