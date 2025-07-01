import axios from 'axios';
import { LoginCredentials, LoginResponse, Article, Category, User, CreateArticleData, UpdateArticleData, CreateCategoryData, UpdateCategoryData, CreateUserData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials: LoginCredentials) => 
    api.post<LoginResponse>('/auth/login', credentials),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getProfile: () => 
    api.get<User>('/auth/me'),
};

// Articles API
export const articlesApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; search?: string; status?: string }) => 
    api.get<{ articles: Article[]; totalPages: number; currentPage: number; total: number }>('/articles', { params }),
  
  getById: (id: string) => 
    api.get<Article>(`/articles/${id}`),
  
  create: (data: CreateArticleData) => 
    api.post<Article>('/articles', data),
  
  update: (id: string, data: UpdateArticleData) => 
    api.put<Article>(`/articles/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/articles/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => 
    api.get<Category[]>('/categories'),
  
  getById: (id: string) => 
    api.get<Category>(`/categories/${id}`),
  
  create: (data: CreateCategoryData) => 
    api.post<Category>('/categories', data),
  
  update: (id: string, data: UpdateCategoryData) => 
    api.put<Category>(`/categories/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/categories/${id}`),
};

// Users API (Admin only)
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; role?: string }) => 
    api.get<{ users: User[]; totalPages: number; currentPage: number; total: number }>('/users', { params }),
  
  getById: (id: string) => 
    api.get<User>(`/users/${id}`),
  
  create: (data: CreateUserData) => 
    api.post<User>('/users', data),
  
  update: (id: string, data: Partial<User>) => 
    api.put<User>(`/users/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/users/${id}`),
};

export default api;