import React from 'react';
import Button from './Button';
import './ErrorPage.css';

const ErrorPage = ({ error, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h2 className="error-title">Oops! Something went wrong</h2>
        <p className="error-message">{error?.message || 'An unexpected error occurred'}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
