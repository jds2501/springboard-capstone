import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageLayout from '../PageLayout';

describe('PageLayout Component', () => {
  it('renders children correctly', () => {
    render(
      <PageLayout>
        <h1>Test Content</h1>
        <p>This is test content</p>
      </PageLayout>
    );
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Content');
    expect(screen.getByText('This is test content')).toBeInTheDocument();
  });

  it('applies default CSS classes', () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>
    );
    
    const pageLayout = screen.getByText('Content').closest('.page-layout');
    expect(pageLayout).toHaveClass('page-layout');
    
    const pageContainer = screen.getByText('Content').closest('.page-container');
    expect(pageContainer).toHaveClass('page-container');
  });

  it('applies custom className correctly', () => {
    render(
      <PageLayout className="custom-page-class">
        <div>Content</div>
      </PageLayout>
    );
    
    const pageLayout = screen.getByText('Content').closest('.page-layout');
    expect(pageLayout).toHaveClass('page-layout', 'custom-page-class');
  });

  it('handles empty className prop', () => {
    render(
      <PageLayout className="">
        <div>Content</div>
      </PageLayout>
    );
    
    const pageLayout = screen.getByText('Content').closest('.page-layout');
    expect(pageLayout).toHaveClass('page-layout');
    expect(pageLayout.className).toBe('page-layout ');
  });

  it('handles multiple custom classes', () => {
    render(
      <PageLayout className="class1 class2 class3">
        <div>Content</div>
      </PageLayout>
    );
    
    const pageLayout = screen.getByText('Content').closest('.page-layout');
    expect(pageLayout).toHaveClass('page-layout', 'class1', 'class2', 'class3');
  });

  it('renders nested structure correctly', () => {
    render(
      <PageLayout>
        <div data-testid="child-content">Test</div>
      </PageLayout>
    );
    
    const childContent = screen.getByTestId('child-content');
    const pageContainer = childContent.parentElement;
    const pageLayout = pageContainer.parentElement;
    
    expect(pageContainer).toHaveClass('page-container');
    expect(pageLayout).toHaveClass('page-layout');
  });

  it('handles multiple children', () => {
    render(
      <PageLayout>
        <header>Header Content</header>
        <main>Main Content</main>
        <footer>Footer Content</footer>
      </PageLayout>
    );
    
    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('handles no children gracefully', () => {
    render(<PageLayout />);
    
    const pageContainer = document.querySelector('.page-container');
    expect(pageContainer).toBeInTheDocument();
    expect(pageContainer).toBeEmptyDOMElement();
  });

  it('handles null children', () => {
    render(<PageLayout>{null}</PageLayout>);
    
    const pageContainer = document.querySelector('.page-container');
    expect(pageContainer).toBeInTheDocument();
  });

  it('handles complex nested content', () => {
    render(
      <PageLayout>
        <div>
          <h1>Title</h1>
          <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
          </div>
        </div>
      </PageLayout>
    );
    
    expect(screen.getByRole('heading')).toHaveTextContent('Title');
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
  });
});
