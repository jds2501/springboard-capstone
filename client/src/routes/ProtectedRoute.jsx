import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '../components';

// Protected Route component that checks authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
