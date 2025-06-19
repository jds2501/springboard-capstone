import { useAuth0 } from '@auth0/auth0-react';
import PageLayout from './PageLayout';
import Card from './Card';
import Button from './Button';
import Icon from './Icon';
import './LandingPage.css';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <PageLayout>
      <Card className="text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1 className="landing-title">Emotional Regulation Journal</h1>
        
        <div className="landing-icon-container">
          <Icon type="star" size="xl" color="primary" />
        </div>
        
        <p className="landing-subtitle">Your mental health journey starts here</p>
        
        <Button 
          onClick={() => loginWithRedirect()}
          variant="primary"
          size="medium"
        >
          Login
        </Button>
      </Card>
    </PageLayout>
  );
};

export default LandingPage;
