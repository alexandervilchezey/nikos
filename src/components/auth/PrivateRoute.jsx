// src/components/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
