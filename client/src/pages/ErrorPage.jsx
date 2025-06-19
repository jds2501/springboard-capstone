import { PageLayout, Card, Button, Icon } from '../components';
import './ErrorPage.css';

const ErrorPage = ({ error, onRetry }) => {
  return (
    <PageLayout>
      <Card className="text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="error-icon-container">
          <Icon type="error" size="xl" color="danger" />
        </div>
        <h2 className="error-title">Oops! Something went wrong</h2>
        <p className="error-message">{error?.message || 'An unexpected error occurred'}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </Card>
    </PageLayout>
  );
};

export default ErrorPage;
