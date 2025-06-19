import './App.css'
import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const {
    isLoading,
    error,
    isAuthenticated,
    user
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    console.log(user);

    return <Dashboard />;
  } else {
    return <LandingPage />;
  }
}

export default App
