// hooks/useAdminAuth.js
import { useAdminAuthContext } from '../context/AdminAuthContext';

export function useAdminAuth() {
  const ctx = useAdminAuthContext();
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
}
