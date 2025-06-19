import './App.css'
import { useAuth0 } from '@auth0/auth0-react';
import { LandingPage, Dashboard, ErrorPage } from './pages';
import { Loading } from './components';

function App() {
  const {
    isLoading,
    error,
    isAuthenticated
  } = useAuth0();

  if (isLoading) {
    return <Loading message="Initializing your journal" />;
  }

  if (error) {
    return <ErrorPage error={error} onRetry={() => window.location.reload()} />;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  } else {
    return <LandingPage />;
  }
}

export default App
