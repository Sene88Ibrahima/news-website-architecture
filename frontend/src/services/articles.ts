import api from './api';

export async function fetchArticles(params?: any) {
  const res = await api.get('/articles', { params });
  return res.data;
}

export async function fetchArticle(id: string) {
  const res = await api.get(`/articles/${id}`);
  return res.data;
}

export async function createArticle(data: any) {
  const res = await api.post('/articles', data);
  return res.data;
}

export async function updateArticle(id: string, data: any) {
  const res = await api.put(`/articles/${id}`, data);
  return res.data;
}

export async function deleteArticle(id: string) {
  const res = await api.delete(`/articles/${id}`);
  return res.data;
}