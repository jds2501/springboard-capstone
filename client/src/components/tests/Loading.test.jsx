import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from '../Loading';

describe('Loading Component', () => {
  it('renders with default loading message', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<Loading message="Please wait while we process your request" />);
    expect(screen.getByText('Please wait while we process your request')).toBeInTheDocument();
  });

  it('renders spinner component', () => {
    render(<Loading />);
    const spinnerElement = document.querySelector('.spinner');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('spinner--large');
  });

  it('wraps content in Card component', () => {
    render(<Loading />);
    const card = document.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('text-center');
  });

  it('applies correct styling to loading message', () => {
    render(<Loading message="Custom loading" />);
    const message = screen.getByText('Custom loading');
    expect(message).toHaveClass('loading__message');
  });
});
