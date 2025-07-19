// context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminLogin, adminMe } from '../api/adminApi';
import {
  getStoredAdminToken,
  setStoredAdminToken,
  clearStoredAdminToken,
} from '../api/apiClient';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);      // user admin (ou null)
  const [token, setToken] = useState(getStoredAdminToken());
  const [loading, setLoading] = useState(!!token); // si token => on tente /me
  const [error, setError] = useState(null);

  // Au montage : si token -> valider /me
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!token) return;
      try {
        const me = await adminMe();
        if (me.role !== 'admin') {
          throw new Error('Accès refusé (pas admin)');
        }
        if (!cancelled) setUser(me);
      } catch (e) {
        console.warn('Bootstrap admin auth failed:', e.message);
        if (!cancelled) {
          logout(); // purge token invalide
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, [token]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await adminLogin(email, password);
      if (data.user?.role !== 'admin') {
        throw new Error('Ce compte n’est pas administrateur.');
      }
      setStoredAdminToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (e) {
      setError(e.message);
      clearStoredAdminToken();
      setToken(null);
      setUser(null);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAdminToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      user, token, loading, error, login, logout, setError
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuthContext() {
  return useContext(AdminAuthContext);
}
