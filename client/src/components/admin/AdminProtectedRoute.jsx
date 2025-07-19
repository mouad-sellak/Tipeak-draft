// components/admin/AdminProtectedRoute.jsx
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  const { user, loading, token } = useAdminAuth();
  if (loading) return <div className="p-10 text-white">Chargement...</div>;
  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
