import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { LandingPage, Dashboard, ErrorPage } from '../pages';
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

// Public Route component for unauthenticated users
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading message="Initializing your journal" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute><LandingPage /></PublicRoute>,
    errorElement: <ErrorPage error={{ message: "Page not found" }} onRetry={() => window.location.reload()} />
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    errorElement: <ErrorPage error={{ message: "Dashboard error" }} onRetry={() => window.location.reload()} />
  },
  // Catch-all route for unknown paths
  {
    path: "*",
    element: <PublicRoute><LandingPage /></PublicRoute>,
  },
  // Add more routes here as you develop
  // {
  //   path: "/add-entry",
  //   element: <ProtectedRoute><AddEntry /></ProtectedRoute>,
  // },
  // {
  //   path: "/trends",
  //   element: <ProtectedRoute><Trends /></ProtectedRoute>,
  // },
  // {
  //   path: "/profile",
  //   element: <ProtectedRoute><Profile /></ProtectedRoute>,
  // },
  // {
  //   path: "/settings",
  //   element: <ProtectedRoute><Settings /></ProtectedRoute>,
  // }
]);

function AppRouter() {
  const { error } = useAuth0();

  if (error) {
    return <ErrorPage error={error} onRetry={() => window.location.reload()} />;
  }

  return <RouterProvider router={router} />;
}

export default AppRouter;
