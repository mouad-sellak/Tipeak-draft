// router.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProTipPage from './pages/ProTipPage';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProsPage from './pages/admin/AdminProsPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/:slug" element={<ProTipPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/pros"
            element={
              <AdminProtectedRoute>
                <AdminProsPage />
              </AdminProtectedRoute>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
