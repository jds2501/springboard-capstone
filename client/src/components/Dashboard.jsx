import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from './Button';
import JournalEntry from './JournalEntry';
import './Dashboard.css';

const Dashboard = () => {
  const { logout, user } = useAuth0();
  
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

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const handleAdd = () => {
    // TODO: Implement add entry functionality
    console.log('Add entry clicked');
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import clicked');
  };

  const handleTrend = () => {
    // TODO: Implement trend analysis functionality
    console.log('Trend clicked');
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
