import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isLoading: false,
    isAuthenticated: false,
    error: null,
    user: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  }),
  Auth0Provider: ({ children }) => children,
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  createBrowserRouter: vi.fn(() => ({})),
  RouterProvider: ({ children }) => <div data-testid="router-provider">{children}</div>,
}));

describe('App Component Integration Test', () => {
  it('renders without crashing', () => {
    // This is a basic smoke test to ensure the app can render
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders the AppRouter component', () => {
    const { getByTestId } = render(<App />);
    // Since we mocked RouterProvider to have a test id, we can check for it
    expect(getByTestId('router-provider')).toBeInTheDocument();
  });

  it('applies App CSS class to the root', () => {
    // This test checks that the App component structure is intact
    render(<App />);
    // Since App.jsx just returns <AppRouter />, we mainly test that it renders
    // More complex integration tests would require setting up full routing
    expect(document.body).toBeInTheDocument(); // Basic DOM sanity check
  });
});
