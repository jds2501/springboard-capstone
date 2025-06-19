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

// Placeholder components for future implementation
function EntryPage() {
  return <div>Entry Page - Add/Edit functionality coming soon</div>;
}

function PreviewPage() {
  return <div>Preview Page - Read-only entry view coming soon</div>;
}

function TrendPage() {
  return <div>Trend Page - Analytics coming soon</div>;
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
    errorElement: <ErrorPage error={{ message: "Page not found" }} onRetry={() => window.location.reload()} />
  },
  {
    path: "/entry",
    element: <ProtectedRoute><EntryPage /></ProtectedRoute>,
    errorElement: <ErrorPage error={{ message: "Entry page error" }} onRetry={() => window.location.reload()} />
  },
  {
    path: "/entry/:id",
    element: <ProtectedRoute><EntryPage /></ProtectedRoute>,
    errorElement: <ErrorPage error={{ message: "Entry page error" }} onRetry={() => window.location.reload()} />
  },
  {
    path: "/preview/:id",
    element: <ProtectedRoute><PreviewPage /></ProtectedRoute>,
    errorElement: <ErrorPage error={{ message: "Preview page error" }} onRetry={() => window.location.reload()} />
  },
  {
    path: "/trend",
    element: <ProtectedRoute><TrendPage /></ProtectedRoute>,
    errorElement: <ErrorPage error={{ message: "Trend page error" }} onRetry={() => window.location.reload()} />
  },
  // Catch-all route for unknown paths
  {
    path: "*",
    element: <HomeRoute />,
  }
]);

function AppRouter() {
  const { error } = useAuth0();

  if (error) {
    return <ErrorPage error={error} onRetry={() => window.location.reload()} />;
  }

  return <RouterProvider router={router} />;
}

export default AppRouter;
