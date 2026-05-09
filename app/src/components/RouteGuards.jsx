import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Redirects authenticated users away from public pages (login, register, landing) */
export function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard'} replace />;
  }
  return children;
}

/** Protects dashboard routes — requires auth + correct role */
export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard'} replace />;
  }
  return children;
}
