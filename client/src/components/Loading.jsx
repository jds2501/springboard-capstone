import PageLayout from './PageLayout';
import Card from './Card';
import Spinner from './Spinner';
import './Loading.css';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <PageLayout>
      <Card className="text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Spinner size="large" />
        <p className="loading__message">{message}</p>
      </Card>
    </PageLayout>
  );
};

export default Loading;
