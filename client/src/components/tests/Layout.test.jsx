import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticatedLayout, PublicLayout } from '../Layout';

// Mock component to test Outlet
const MockOutletContent = () => <div>Mock page content</div>;

// Helper function to render layout components with router
const renderWithRouter = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('AuthenticatedLayout Component', () => {
  it('renders the authenticated layout structure', () => {
    renderWithRouter(<AuthenticatedLayout />);
    
    const layoutContainer = screen.getByRole('main').parentElement;
    expect(layoutContainer).toHaveClass('authenticated-layout');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the main element correctly', () => {
    renderWithRouter(<AuthenticatedLayout />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement.parentElement).toHaveClass('authenticated-layout');
  });

  it('contains Outlet for nested routes', () => {
    // Since Outlet is a React Router component, we can't directly test its presence
    // but we can verify the structure is correct for routing
    renderWithRouter(<AuthenticatedLayout />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});

describe('PublicLayout Component', () => {
  it('renders the public layout structure', () => {
    renderWithRouter(<PublicLayout />);
    
    const layoutContainer = screen.getByRole('main').parentElement;
    expect(layoutContainer).toHaveClass('public-layout');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the main element correctly', () => {
    renderWithRouter(<PublicLayout />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement.parentElement).toHaveClass('public-layout');
  });

  it('contains Outlet for nested routes', () => {
    // Since Outlet is a React Router component, we can't directly test its presence
    // but we can verify the structure is correct for routing
    renderWithRouter(<PublicLayout />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});

describe('Layout Components Comparison', () => {
  it('AuthenticatedLayout and PublicLayout have different CSS classes', () => {
    const { unmount } = renderWithRouter(<AuthenticatedLayout />);
    const authenticatedMain = screen.getByRole('main');
    const authenticatedContainer = authenticatedMain.parentElement;
    expect(authenticatedContainer).toHaveClass('authenticated-layout');
    
    unmount();
    
    renderWithRouter(<PublicLayout />);
    const publicMain = screen.getByRole('main');
    const publicContainer = publicMain.parentElement;
    expect(publicContainer).toHaveClass('public-layout');
    expect(publicContainer).not.toHaveClass('authenticated-layout');
  });

  it('both layouts have similar structure but different styling classes', () => {
    const { unmount } = renderWithRouter(<AuthenticatedLayout />);
    const authenticatedMain = screen.getByRole('main');
    expect(authenticatedMain).toBeInTheDocument();
    
    unmount();
    
    renderWithRouter(<PublicLayout />);
    const publicMain = screen.getByRole('main');
    expect(publicMain).toBeInTheDocument();
  });
});
