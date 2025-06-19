import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ErrorPage, EntryPage, PreviewPage, TrendPage } from '../pages';
import ProtectedRoute from './ProtectedRoute';
import HomeRoute from './HomeRoute';

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
