// api/apiClient.js
// ---------------------------------------------------------
// Client générique fetch wrapper avec gestion JSON, erreurs,
// injection du token JWT admin si présent.
// ---------------------------------------------------------
const API_BASE = ''; // relatif -> proxy Nginx / Vite vers /api

export function getStoredAdminToken() {
  return localStorage.getItem('tipeak_admin_token') || null;
}

export function setStoredAdminToken(token) {
  if (token) localStorage.setItem('tipeak_admin_token', token);
}

export function clearStoredAdminToken() {
  localStorage.removeItem('tipeak_admin_token');
}

/**
 * Requête HTTP générique.
 * @param {string} method 
 * @param {string} url ex: '/api/users'
 * @param {object} options { body, auth }
 */
export async function http(method, url, { body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getStoredAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch  { /* ignore */ }

  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Erreur HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (url, opts) => http('GET', url, opts),
  post: (url, body, opts) => http('POST', url, { ...opts, body }),
  patch: (url, body, opts) => http('PATCH', url, { ...opts, body }),
  del: (url, opts) => http('DELETE', url, opts),
};
