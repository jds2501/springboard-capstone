import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, JournalEntry, Spinner } from '../components';
import { useAppNavigation } from '../routes';
import { useApi } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { logout, user, getAccessTokenSilently } = useAuth0();
  const { goToAddEntry, goToTrend } = useAppNavigation();
  const api = useApi(getAccessTokenSilently);
  const hasInitialized = useRef(false);
  
  const [entries, setEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true); // Start with loading true
  const [entriesError, setEntriesError] = useState(null);

  // Find or create user and load entries when component mounts and user is authenticated
  useEffect(() => {
    if (hasInitialized.current || !getAccessTokenSilently) return;
    
    const initializeData = async () => {
      try {
        // Find or create user
        await api.users.findOrCreate();
        
        // Load entries
        setEntriesError(null);
        
        const entriesData = await api.entries.getAll();
        // Extract entries array from the response object
        const entriesArray = entriesData?.entries || [];
        setEntries(entriesArray);
        
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error initializing data:', error);
        setEntriesError(error.message || 'Failed to load data');
        setEntries([]);
      } finally {
        setIsLoadingEntries(false);
      }
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAccessTokenSilently]); // Simplified dependencies

  // Function to refresh entries
  const refreshEntries = async () => {
    setIsLoadingEntries(true);
    setEntriesError(null);
    
    try {
      const entriesData = await api.entries.getAll();
      // Extract entries array from the response object
      const entriesArray = entriesData?.entries || [];
      setEntries(entriesArray);
    } catch (error) {
      console.error('Error refreshing entries:', error);
      setEntriesError(error.message || 'Failed to refresh entries');
    } finally {
      setIsLoadingEntries(false);
    }
  };

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
          {isLoadingEntries ? (
            <div className="entries-loading">
              <Spinner size="medium" />
              <p>Loading your journal entries...</p>
            </div>
          ) : entriesError ? (
            <div className="error-message">
              <p>Error loading entries: {entriesError}</p>
              <Button 
                variant="secondary" 
                onClick={refreshEntries}
              >
                Retry
              </Button>
            </div>
          ) : entries.length > 0 ? (
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
