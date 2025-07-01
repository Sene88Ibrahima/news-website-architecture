import api from './api';

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getProfile() {
  const res = await api.get('/auth/me');
  return res.data;
}