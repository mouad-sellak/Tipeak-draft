// api/adminApi.js
import { api } from './apiClient';

// LOGIN
export async function adminLogin(email, password) {
  return api.post('/api/auth/login', { email, password }, { auth: false });
}

// /me
export async function adminMe() {
const data = await api.get('/api/auth/me');
  return data.user || data;  // normalise : accepte {user:{}} ou direct {}
}

// Pros
export async function listPros({ page = 1, limit = 25 } = {}) {
  return api.get(`/api/users?role=pro&page=${page}&limit=${limit}`);
}

export async function createPro(payload) {
  return api.post('/api/users', payload);
}

export async function updatePro(id, payload) {
  return api.patch(`/api/users/${id}`, payload);
}

export async function getPro(id) {
  return api.get(`/api/users/${id}`);
}

export async function getProQr(id) {
  return api.get(`/api/users/${id}/qr`);
}
