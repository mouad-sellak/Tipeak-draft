// pages/admin/AdminLoginPage.jsx
import { useAdminAuth } from '../../hooks/useAdminAuth';
import LoginForm from '../../components/admin/LoginForm';
import { Navigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const { user, login, loading, error, setError } = useAdminAuth();

  if (user) {
    return <Navigate to="/admin/pros" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] px-4">
      <LoginForm
        onSubmit={(email, password) => {
          setError(null);
          login(email, password);
        }}
        loading={loading}
        error={error}
      />
    </div>
  );
}
