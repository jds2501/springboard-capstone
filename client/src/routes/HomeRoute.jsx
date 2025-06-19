import { useAuth0 } from '@auth0/auth0-react';
import { LandingPage, Dashboard } from '../pages';
import { Loading } from '../components';

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

export default HomeRoute;
