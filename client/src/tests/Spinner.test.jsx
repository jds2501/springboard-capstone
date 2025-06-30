import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../components/Spinner';

describe('Spinner Component', () => {
  it('renders with default medium size', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner--medium');
  });

  it('renders with custom size', () => {
    const { container } = render(<Spinner size="large" />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('spinner--large');
  });

  it('renders with small size', () => {
    const { container } = render(<Spinner size="small" />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('spinner--small');
  });

  it('contains three spinner rings', () => {
    const { container } = render(<Spinner />);
    const rings = container.querySelectorAll('.spinner__ring');
    expect(rings).toHaveLength(3);
  });

  it('always has base spinner class', () => {
    const { container } = render(<Spinner size="large" />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('spinner');
  });
});
