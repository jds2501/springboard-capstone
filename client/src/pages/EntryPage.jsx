import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout, Button } from '../components';
import './EntryPage.css';

function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Saving entry:', formData);
    // For now, just go back to dashboard
    navigate('/');
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
              >
                {isEditing ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

export default EntryPage;
