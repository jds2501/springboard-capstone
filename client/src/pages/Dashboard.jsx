import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, JournalEntry } from '../components';
import { useAppNavigation } from '../routes';
import './Dashboard.css';

const Dashboard = () => {
  const { logout, user, getAccessTokenSilently } = useAuth0();
  const { goToAddEntry, goToTrend } = useAppNavigation()
  
  // Mock data for journal entries (will be replaced with API calls later)
  const [entries] = useState([
    {
      id: 1,
      date: '12/4/2023',
      title: 'A happy day',
      content: 'Today was a wonderful day...'
    },
    {
      id: 2,
      date: '1/5/2024',
      title: 'A sad day',
      content: 'Feeling down today...'
    },
    {
      id: 3,
      date: '4/5/2024',
      title: 'A mediocre day',
      content: 'Just an average day...'
    }
  ]);

  // Find or create user when component mounts and user is authenticated
  useEffect(() => {
    const findOrCreateUser = async () => {      
      try {
        const token = await getAccessTokenSilently({
          // audience: 'emotional-journal-api', // Temporarily disable
          cacheMode: 'off' // Force fresh token, bypass cache
        });
        
        // Use environment variable for API URL, fallback to relative path
        const apiUrl = import.meta.env.DEV ? '/api/users' : `${import.meta.env.VITE_API_BASE_URL}/users`;
        
        // Temporary debug logs
        console.log('Debug - Environment check:');
        console.log('- DEV mode:', import.meta.env.DEV);
        console.log('- API URL:', apiUrl);
        console.log('- Token preview:', token?.substring(0, 50) + '...');

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(`Failed to register user: ${response.status} - ${response.statusText} - ${responseText}`);
        } else {
          const data = await response.json();
          console.log('User registered or found:', data);       
        }
      } catch (error) {
        console.error('Error finding or creating user:', error);
      }
    };

    findOrCreateUser();
  }, [getAccessTokenSilently]);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const handleAdd = () => {
    goToAddEntry();
  };

  const handleImport = () => {
    // TODO: Implement import functionality
  };

  const handleTrend = () => {
    goToTrend();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            {user?.name ? `${user.name}'s Journal` : "Jason's Journal"}
          </h1>
          <Button 
            variant="primary" 
            size="small" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </header>

        <div className="dashboard-actions">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleAdd}
          >
            Add
          </Button>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleImport}
          >
            Import
          </Button>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleTrend}
          >
            Trend
          </Button>
        </div>

        <div className="entries-container">
          {entries.length > 0 ? (
            entries.map(entry => (
              <JournalEntry
                key={entry.id}
                entry={entry}
              />
            ))
          ) : (
            <div className="no-entries">
              <p>No journal entries yet. Start by adding your first entry!</p>
              <Button variant="primary" onClick={handleAdd}>
                Add Your First Entry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
