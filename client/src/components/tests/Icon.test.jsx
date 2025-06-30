import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Icon from '../Icon';

describe('Icon Component', () => {
  it('renders with default props', () => {
    render(<Icon type="star" data-testid="test-icon" />);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('icon', 'icon--medium', 'icon--default');
  });

  it('renders different icon types correctly', () => {
    const { rerender } = render(<Icon type="star" data-testid="test-icon" />);
    let icon = screen.getByTestId('test-icon');
    expect(icon.querySelector('path')).toHaveAttribute('d', expect.stringContaining('12 2l3.09 6.26L22 9.27'));

    rerender(<Icon type="error" data-testid="test-icon" />);
    icon = screen.getByTestId('test-icon');
    expect(icon.querySelector('path')).toHaveAttribute('d', expect.stringContaining('12 2C6.48 2 2 6.48'));

    rerender(<Icon type="check" data-testid="test-icon" />);
    icon = screen.getByTestId('test-icon');
    expect(icon.querySelector('path')).toHaveAttribute('d', expect.stringContaining('9 16.17L4.83 12'));

    rerender(<Icon type="warning" data-testid="test-icon" />);
    icon = screen.getByTestId('test-icon');
    expect(icon.querySelector('path')).toHaveAttribute('d', expect.stringContaining('1 21h22L12 2'));
  });

  it('falls back to star icon for unknown type', () => {
    render(<Icon type="unknown" data-testid="test-icon" />);
    const icon = screen.getByTestId('test-icon');
    expect(icon.querySelector('path')).toHaveAttribute('d', expect.stringContaining('12 2l3.09 6.26L22 9.27'));
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Icon type="star" size="small" data-testid="test-icon" />);
    let icon = screen.getByTestId('test-icon');
    expect(icon).toHaveClass('icon--small');

    rerender(<Icon type="star" size="large" data-testid="test-icon" />);
    icon = screen.getByTestId('test-icon');
    expect(icon).toHaveClass('icon--large');
  });

  it('applies color classes correctly', () => {
    const { rerender } = render(<Icon type="star" color="primary" data-testid="test-icon" />);
    let icon = screen.getByTestId('test-icon');
    expect(icon).toHaveClass('icon--primary');

    rerender(<Icon type="star" color="danger" data-testid="test-icon" />);
    icon = screen.getByTestId('test-icon');
    expect(icon).toHaveClass('icon--danger');
  });

  it('applies custom className', () => {
    render(<Icon type="star" className="custom-class" data-testid="test-icon" />);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Icon type="star" data-testid="custom-icon" aria-label="Custom star icon" />);
    const icon = screen.getByTestId('custom-icon');
    expect(icon).toHaveAttribute('aria-label', 'Custom star icon');
  });

  it('has correct SVG attributes', () => {
    render(<Icon type="star" data-testid="test-icon" />);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('fill', 'currentColor');
  });
});
