import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorPage from '../ErrorPage';

// Mock the components used by ErrorPage
vi.mock('../../components', () => ({
  PageLayout: ({ children }) => <div data-testid="page-layout">{children}</div>,
  Card: ({ children, className, style }) => (
    <div data-testid="card" className={className} style={style}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, variant }) => (
    <button data-testid="retry-button" onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
  Icon: ({ type, size, color }) => (
    <div data-testid="icon" data-type={type} data-size={size} data-color={color} />
  ),
}));

describe('ErrorPage Component', () => {
  it('renders the error page with default message when no error is provided', () => {
    render(<ErrorPage />);
    
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('renders the error page with custom error message', () => {
    const customError = { message: 'Custom error message' };
    render(<ErrorPage error={customError} />);
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('An unexpected error occurred')).not.toBeInTheDocument();
  });

  it('renders the retry button when onRetry prop is provided', () => {
    const mockOnRetry = vi.fn();
    render(<ErrorPage onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByTestId('retry-button');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveTextContent('Try Again');
    expect(retryButton).toHaveAttribute('data-variant', 'primary');
  });

  it('does not render retry button when onRetry prop is not provided', () => {
    render(<ErrorPage />);
    
    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });

  it('calls onRetry function when retry button is clicked', () => {
    const mockOnRetry = vi.fn();
    render(<ErrorPage onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByTestId('retry-button');
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders the error icon with correct props', () => {
    render(<ErrorPage />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-type', 'error');
    expect(icon).toHaveAttribute('data-size', 'xl');
    expect(icon).toHaveAttribute('data-color', 'danger');
  });

  it('applies correct styling to the card component', () => {
    render(<ErrorPage />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('text-center');
    expect(card).toHaveStyle({
      maxWidth: '500px',
      margin: '0 auto',
    });
  });

  it('handles error object with null or undefined message', () => {
    const errorWithNullMessage = { message: null };
    render(<ErrorPage error={errorWithNullMessage} />);
    
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('handles error object with empty string message', () => {
    const errorWithEmptyMessage = { message: '' };
    render(<ErrorPage error={errorWithEmptyMessage} />);
    
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('renders with both error and onRetry props', () => {
    const customError = { message: 'Something went wrong with the server' };
    const mockOnRetry = vi.fn();
    
    render(<ErrorPage error={customError} onRetry={mockOnRetry} />);
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong with the server')).toBeInTheDocument();
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    
    // Test that retry button works
    fireEvent.click(screen.getByTestId('retry-button'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('has proper DOM structure and CSS classes', () => {
    render(<ErrorPage />);
    
    // Check for the error icon container
    const iconContainer = screen.getByTestId('icon').closest('.error-icon-container');
    expect(iconContainer).toBeInTheDocument();
    
    // Check for the error title
    const title = screen.getByText('Oops! Something went wrong');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H2');
    expect(title).toHaveClass('error-title');
    
    // Check for the error message
    const message = screen.getByText('An unexpected error occurred');
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('P');
    expect(message).toHaveClass('error-message');
  });
});
