import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from '../LandingPage';

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

// Mock the components used by LandingPage
vi.mock('../../components', () => ({
  PageLayout: ({ children }) => <div data-testid="page-layout">{children}</div>,
  Card: ({ children, className, style }) => (
    <div data-testid="card" className={className} style={style}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, variant, size }) => (
    <button 
      data-testid="login-button" 
      onClick={onClick} 
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
  Icon: ({ type, size, color }) => (
    <div data-testid="icon" data-type={type} data-size={size} data-color={color} />
  ),
}));

describe('LandingPage Component', () => {
  const mockLoginWithRedirect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default Auth0 mock setup
    useAuth0.mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  describe('Rendering', () => {
    it('renders the landing page with all required elements', () => {
      render(<LandingPage />);
      
      // Check that the main layout is rendered
      expect(screen.getByTestId('page-layout')).toBeInTheDocument();
      
      // Check that the card container is rendered
      expect(screen.getByTestId('card')).toBeInTheDocument();
      
      // Check the main title
      expect(screen.getByText('Emotional Regulation Journal')).toBeInTheDocument();
      expect(screen.getByText('Emotional Regulation Journal')).toHaveClass('landing-title');
      
      // Check the subtitle
      expect(screen.getByText('Your mental health journey starts here')).toBeInTheDocument();
      expect(screen.getByText('Your mental health journey starts here')).toHaveClass('landing-subtitle');
      
      // Check the icon
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-type', 'star');
      expect(icon).toHaveAttribute('data-size', 'xl');
      expect(icon).toHaveAttribute('data-color', 'primary');
      
      // Check the login button
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent('Login');
      expect(loginButton).toHaveAttribute('data-variant', 'primary');
      expect(loginButton).toHaveAttribute('data-size', 'medium');
    });

    it('applies correct CSS classes and styles to elements', () => {
      render(<LandingPage />);
      
      // Check card styling
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('text-center');
      expect(card).toHaveStyle({
        maxWidth: '400px',
        margin: '0 auto'
      });
      
      // Check icon container exists
      const iconContainer = screen.getByTestId('icon').parentElement;
      expect(iconContainer).toHaveClass('landing-icon-container');
    });
  });

  describe('Authentication Integration', () => {
    it('calls loginWithRedirect when login button is clicked', () => {
      render(<LandingPage />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
      expect(mockLoginWithRedirect).toHaveBeenCalledWith();
    });

    it('handles multiple login button clicks correctly', () => {
      render(<LandingPage />);
      
      const loginButton = screen.getByTestId('login-button');
      
      // Click multiple times
      fireEvent.click(loginButton);
      fireEvent.click(loginButton);
      fireEvent.click(loginButton);
      
      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(3);
    });

    it('renders correctly when Auth0 is loading', () => {
      useAuth0.mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isAuthenticated: false,
        isLoading: true,
      });

      render(<LandingPage />);
      
      // Should still render all elements even when loading
      expect(screen.getByText('Emotional Regulation Journal')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('renders correctly when user is already authenticated', () => {
      useAuth0.mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        isAuthenticated: true,
        isLoading: false,
      });

      render(<LandingPage />);
      
      // Should still render the landing page (navigation handled elsewhere)
      expect(screen.getByText('Emotional Regulation Journal')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<LandingPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Emotional Regulation Journal');
    });

    it('has an accessible login button', () => {
      render(<LandingPage />);
      
      const loginButton = screen.getByRole('button', { name: 'Login' });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent('Login');
    });

    it('maintains semantic structure', () => {
      render(<LandingPage />);
      
      // Check that we have the main structural elements
      expect(screen.getByTestId('page-layout')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('works with empty loginWithRedirect function', () => {
      const emptyMockFunction = vi.fn();
      useAuth0.mockReturnValue({
        loginWithRedirect: emptyMockFunction,
        isAuthenticated: false,
        isLoading: false,
      });

      render(<LandingPage />);
      
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      
      // Should call the empty function without issues
      fireEvent.click(loginButton);
      expect(emptyMockFunction).toHaveBeenCalledTimes(1);
    });

    it('handles Auth0 hook with partial data correctly', () => {
      useAuth0.mockReturnValue({
        loginWithRedirect: mockLoginWithRedirect,
        // Missing isAuthenticated and isLoading - but that's okay for our component
      });

      // Should still render successfully
      expect(() => render(<LandingPage />)).not.toThrow();
      
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      
      // Should work normally
      fireEvent.click(loginButton);
      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    });

    it('handles loginWithRedirect that resolves normally', () => {
      const asyncMockFunction = vi.fn().mockResolvedValue(undefined);
      
      useAuth0.mockReturnValue({
        loginWithRedirect: asyncMockFunction,
        isAuthenticated: false,
        isLoading: false,
      });

      render(<LandingPage />);
      
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      
      // Should call the async function without issues
      fireEvent.click(loginButton);
      expect(asyncMockFunction).toHaveBeenCalledTimes(1);
    });

    it('renders with different auth states', () => {
      // Test with various combinations of auth states
      const authStates = [
        { isAuthenticated: true, isLoading: false },
        { isAuthenticated: false, isLoading: true },
        { isAuthenticated: true, isLoading: true },
        { isAuthenticated: false, isLoading: false },
      ];

      authStates.forEach((authState) => {
        useAuth0.mockReturnValue({
          loginWithRedirect: mockLoginWithRedirect,
          ...authState,
        });

        const { unmount } = render(<LandingPage />);
        
        // Should render successfully regardless of auth state
        expect(screen.getByText('Emotional Regulation Journal')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Component Structure', () => {
    it('renders components in the correct hierarchy', () => {
      render(<LandingPage />);
      
      const pageLayout = screen.getByTestId('page-layout');
      const card = screen.getByTestId('card');
      const icon = screen.getByTestId('icon');
      const button = screen.getByTestId('login-button');
      
      // Check that card is inside page layout
      expect(pageLayout).toContainElement(card);
      
      // Check that all content is inside the card
      expect(card).toContainElement(screen.getByText('Emotional Regulation Journal'));
      expect(card).toContainElement(icon);
      expect(card).toContainElement(screen.getByText('Your mental health journey starts here'));
      expect(card).toContainElement(button);
    });

    it('has correct component props', () => {
      render(<LandingPage />);
      
      // Verify button props
      const button = screen.getByTestId('login-button');
      expect(button).toHaveAttribute('data-variant', 'primary');
      expect(button).toHaveAttribute('data-size', 'medium');
      
      // Verify icon props
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-type', 'star');
      expect(icon).toHaveAttribute('data-size', 'xl');
      expect(icon).toHaveAttribute('data-color', 'primary');
      
      // Verify card props
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('text-center');
    });
  });
});
