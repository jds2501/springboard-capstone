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

// Home Route component that shows different content based on auth state
function HomeRoute() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading message="Initializing your journal" />;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
    errorElement: <ErrorPage error={{ message: "Page not found" }} onRetry={() => window.location.reload()} />
  },
  // Catch-all route for unknown paths
  {
    path: "*",
    element: <HomeRoute />,
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
