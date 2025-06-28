import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout, Button } from '../components';
import './EntryPage.css';

function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const isEditing = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    description: ''
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get the access token from Auth0
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      // Prepare the API URL
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/entries`;

      // Make the API call to create the entry
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create entry: ${response.status}`);
      }

      const newEntry = await response.json();
      console.log('Entry created successfully:', newEntry);
      
      // Navigate back to dashboard on success
      navigate('/');
    } catch (err) {
      console.error('Error creating entry:', err);
      setError(err.message || 'Failed to create entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PageLayout>
      <div className="entry-page">
        <div className="entry-page__container">
          <h1 className="entry-page__title">
            {isEditing ? `Edit Entry ${id}` : 'Add Entry'}
          </h1>
          
          {error && (
            <div className="entry-page__error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="entry-page__form">
            <div className="entry-page__form-group">
              <label htmlFor="title" className="entry-page__form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="entry-page__form-input"
                placeholder="Enter a title for your entry"
                required
              />
            </div>

            <div className="entry-page__form-group">
              <label htmlFor="date" className="entry-page__form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="entry-page__form-input"
                required
              />
            </div>

            <div className="entry-page__form-group">
              <label htmlFor="description" className="entry-page__form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="entry-page__form-textarea"
                placeholder="Write about your thoughts and feelings..."
                rows={8}
                required
              />
            </div>

            <div className="entry-page__form-actions">
              <Button 
                type="button"
                variant="secondary" 
                onClick={handleBack}
                className="entry-page__back-button"
              >
                Back
              </Button>
              <Button 
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

export default EntryPage;
