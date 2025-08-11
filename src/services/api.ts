import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const boardsApi = {
  getAll: () => api.get('/boards'),
  getById: (id: string) => api.get(`/boards/${id}`),
  create: (data: any) => api.post('/boards', data),
  update: (id: string, data: any) => api.put(`/boards/${id}`, data),
  delete: (id: string) => api.delete(`/boards/${id}`),
};

export const listsApi = {
  getAll: () => api.get('/lists'),
  getByBoard: (boardId: string) => api.get(`/boards/${boardId}/lists`),
  getById: (id: string) => api.get(`/lists/${id}`),
  create: (data: any) => api.post('/lists', data),
  update: (id: string, data: any) => api.put(`/lists/${id}`, data),
  updatePositions: (updates: Array<{ id: string; position: number }>) => 
    api.patch('/lists/positions', { updates }),
  delete: (id: string) => api.delete(`/lists/${id}`),
};

export const tasksApi = {
  getAll: () => api.get('/tasks'),
  getByList: (listId: string) => api.get(`/lists/${listId}/tasks`),
  getByBoard: (boardId: string) => api.get(`/tasks/board/${boardId}`),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  move: (id: string, listId: string, position?: number) =>
    api.patch(`/tasks/${id}/move`, { listId, position }),
  updatePosition: (id: string, position: number) =>
    api.patch(`/tasks/${id}/position`, { position }),
  updatePositions: (updates: Array<{ id: string; position: number }>) =>
    api.patch('/tasks/positions', { updates }),
};

export const activityApi = {
  getBoardActivity: (boardId: string, limit?: number) => 
    api.get(`/activity/board/${boardId}`, { params: { limit } }),
  getUserActivity: (userId: string, limit?: number) => 
    api.get(`/activity/user/${userId}`, { params: { limit } }),
};

export const commentsApi = {
  getByTask: (taskId: string) => api.get(`/comments/task/${taskId}`),
  getById: (id: string) => api.get(`/comments/${id}`),
  create: (data: { taskId: string; content: string; userId?: string }) => 
    api.post('/comments', data),
  update: (id: string, data: { content: string }) => 
    api.put(`/comments/${id}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
  getCount: (taskId: string) => api.get(`/comments/count/${taskId}`),
};

export default api;
