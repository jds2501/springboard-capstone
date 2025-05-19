import './App.css'
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const {
    isLoading,
    error,
    isAuthenticated,
    loginWithRedirect,
    logout,
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

    return (
      <button onClick={() => {
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      }}>Log out</button>
    );
  } else {
    return (
      <button onClick={loginWithRedirect}>Log in</button>
    );
  }
}

export default App
