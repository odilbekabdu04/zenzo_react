import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Yuklanmoqda
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1418',
          color: '#5ac5d4',
          fontSize: 18,
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        Yuklanmoqda...
      </div>
    );
  }

  // User yo'q — login'ga
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol tekshiruvi
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect = user.role === 'admin' ? '/dashboard/overview' : '/market';
    return <Navigate to={redirect} replace />;
  }

  return children;
}