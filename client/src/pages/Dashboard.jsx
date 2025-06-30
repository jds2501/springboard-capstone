import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, JournalEntry, Spinner } from '../components';
import { useAppNavigation } from '../routes';
import { useApi } from '../utils/api';
import './Dashboard.css';

// Configuration constants
const ENTRIES_PER_PAGE = 6; // Mobile-optimized page size

const Dashboard = () => {
  const { logout, user, getAccessTokenSilently } = useAuth0();
  const { goToAddEntry, goToTrend, goToPreviewEntry } = useAppNavigation();
  const api = useApi(getAccessTokenSilently);
  const hasInitialized = useRef(false);
  
  const [entries, setEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true); // Start with loading true
  const [entriesError, setEntriesError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ENTRIES_PER_PAGE,
    totalPages: 1,
    totalResults: 0
  });

  // Find or create user and load entries when component mounts and user is authenticated
  useEffect(() => {
    if (hasInitialized.current || !getAccessTokenSilently) return;
    
    const initializeData = async () => {
      try {
        // Find or create user
        await api.users.findOrCreate();
        
        // Load entries
        setEntriesError(null);
        
        const entriesData = await api.entries.getAll({ page: 1, limit: ENTRIES_PER_PAGE });
        // Extract entries array and pagination from the response object
        const entriesArray = entriesData?.entries || [];
        const paginationData = entriesData?.pagination || pagination;
        setEntries(entriesArray);
        setPagination(paginationData);
        
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

  // Load entries when page changes
  useEffect(() => {
    if (!hasInitialized.current) return;
    
    const loadEntriesForPage = async () => {
      setIsLoadingEntries(true);
      setEntriesError(null);
      
      try {
        const entriesData = await api.entries.getAll({ page: currentPage, limit: ENTRIES_PER_PAGE });
        const entriesArray = entriesData?.entries || [];
        const paginationData = entriesData?.pagination || pagination;
        setEntries(entriesArray);
        setPagination(paginationData);
      } catch (error) {
        console.error('Error loading entries for page:', error);
        setEntriesError(error.message || 'Failed to load entries');
      } finally {
        setIsLoadingEntries(false);
      }
    };

    loadEntriesForPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Function to refresh entries
  const refreshEntries = async () => {
    setIsLoadingEntries(true);
    setEntriesError(null);
    
    try {
      const entriesData = await api.entries.getAll({ page: currentPage, limit: ENTRIES_PER_PAGE });
      // Extract entries array and pagination from the response object
      const entriesArray = entriesData?.entries || [];
      const paginationData = entriesData?.pagination || pagination;
      setEntries(entriesArray);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error refreshing entries:', error);
      setEntriesError(error.message || 'Failed to refresh entries');
    } finally {
      setIsLoadingEntries(false);
    }
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const handleEntryClick = (entry) => {
    goToPreviewEntry(entry.id);
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
            <>
              <div className="entries-list">
                {entries.map(entry => (
                  <JournalEntry
                    key={entry.id}
                    entry={entry}
                    onEntryClick={handleEntryClick}
                  />
                ))}
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    <span>
                      Showing {entries.length} of {pagination.totalResults} entries
                      (Page {pagination.page} of {pagination.totalPages})
                    </span>
                  </div>
                  
                  <div className="pagination-controls">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="pagination-pages">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                        let pageNumber;
                        if (pagination.totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNumber = pagination.totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "primary" : "secondary"}
                            size="small"
                            onClick={() => handlePageClick(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleNextPage}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
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
