// types/index.ts
// Définitions de types pour l'application

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'VISITOR' | 'EDITOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  published: boolean;
  status?: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string;
  author: {
    id: string;
    username: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface AuthToken {
  id: string;
  token: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: PaginationInfo;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  published?: boolean;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'VISITOR' | 'EDITOR' | 'ADMIN';
}