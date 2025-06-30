import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, MarkdownPreview, Spinner } from '../components';
import { useApi } from '../utils/api';
import './PreviewPage.css';

function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const api = useApi(getAccessTokenSilently);
  
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if we have an ID
    if (!id) {
      setIsLoading(false);
      setError('Invalid entry ID');
      return;
    }

    const fetchEntry = async () => {
      await api.executeWithState(
        () => api.entries.getById(id),
        {
          onStart: () => {
            setIsLoading(true);
            setError(null);
            setEntry(null); // Clear any previous entry data
          },
          onSuccess: (fetchedEntry) => {
            setEntry(fetchedEntry);
          },
          onError: (err) => {
            console.error('Error fetching entry:', err);
            setError(err.message || 'Failed to load entry');
            setEntry(null); // Clear entry data on error
          },
          onFinally: () => {
            setIsLoading(false);
          }
        }
      );
    };

    fetchEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id to prevent infinite re-renders

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/entry/${id}`);
  };

  // Show loading state first
  if (isLoading) {
    return (
      <div className="preview-page">
        <div className="preview-page__container">
          <div className="preview-page__loading">
            <Spinner size="medium" />
            <p>Loading entry...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="preview-page">
        <div className="preview-page__container">
          <h1>Error</h1>
          <p className="preview-page__error">{error}</p>
          <Button onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!entry) {
    return (
      <div className="preview-page">
        <div className="preview-page__container">
          <h1>Entry Not Found</h1>
          <p>The entry you're looking for doesn't exist.</p>
          <Button onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Show entry content only when we have data
  return (
    <div className="preview-page">
      <div className="preview-page__container">
        <div className="preview-page__header">
          <h1 className="preview-page__title">{entry.title}</h1>
          <p className="preview-page__date">
            {new Date(entry.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="preview-page__content">
          <MarkdownPreview 
            content={entry.description}
            className="markdown-preview--readonly"
            showPlaceholder={false}
          />
        </div>

        <div className="preview-page__actions">
          <Button 
            variant="secondary" 
            onClick={handleBack}
          >
            Back
          </Button>
          <Button 
            variant="primary"
            onClick={handleEdit}
          >
            Edit Entry
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
