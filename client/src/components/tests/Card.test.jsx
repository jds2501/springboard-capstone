import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default card classes', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('card', 'card-content');
  });

  it('applies small size class when size is small', () => {
    render(<Card size="small" data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('card', 'card-small');
    expect(card).not.toHaveClass('card-content');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('card', 'card-content', 'custom-class');
  });

  it('combines all classes correctly', () => {
    render(<Card size="small" className="my-custom-class" data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('card', 'card-small', 'my-custom-class');
  });
});
