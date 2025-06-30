import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Spinner, PageLayout } from '../components';
import { useAppNavigation } from '../routes';
import { useApi } from '../utils/api';
import './TrendPage.css';

function TrendPage() {
  const { getAccessTokenSilently } = useAuth0();
  const { goToHome } = useAppNavigation();
  const api = useApi(getAccessTokenSilently);

  // Form state for date range
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  // Analysis state
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Set default date range on component mount
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setDateRange({
      from: thirtyDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    });
  }, []);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    if (!dateRange.from || !dateRange.to) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(dateRange.from) > new Date(dateRange.to)) {
      setError('Start date must be before end date');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await api.entries.analyzeTrend(dateRange);
      setAnalysis(result.analysis);
    } catch (err) {
      console.error('Error analyzing trends:', err);
      setError(err.message || 'Failed to analyze trends. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageLayout className="trend-page">
      <div className="trend-container">
        <div className="trend-header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={goToHome}
            className="back-button"
          >
            Back
          </Button>
          <h1 className="trend-title">Trend Analysis</h1>
        </div>

        <div className="trend-description">
          <p>
            In the journey of emotional regulation, understanding the nuances of our feelings is 
            vital. This journal helps to identify patterns and triggers, offering insights into emotional 
            responses. By documenting experiences, one can develop healthier coping mechanisms 
            and enhance emotional intelligence.
          </p>
        </div>

        <div className="trend-form">
          <div className="date-inputs">
            <div className="date-input-group">
              <label htmlFor="from-date" className="date-label">From</label>
              <input
                id="from-date"
                type="date"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="date-input"
                max={dateRange.to || undefined}
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="to-date" className="date-label">To</label>
              <input
                id="to-date"
                type="date"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="date-input"
                min={dateRange.from || undefined}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-actions">
            <Button 
              variant="primary" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !dateRange.from || !dateRange.to}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Trends'}
            </Button>
          </div>
        </div>

        <div className="trend-content">
          {error && (
            <div className="trend-error">
              <p>{error}</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="trend-loading">
              <Spinner size="large" />
              <p>Analyzing your journal entries...</p>
            </div>
          )}

          {analysis && !isAnalyzing && (
            <div className="trend-results">
              <h2 className="results-title">Analysis Results</h2>
              <div className="analysis-content">
                <div className="analysis-text">
                  {analysis.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="analysis-paragraph">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default TrendPage;
