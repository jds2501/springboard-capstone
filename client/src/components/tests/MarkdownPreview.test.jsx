import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownPreview from '../MarkdownPreview';

describe('MarkdownPreview Component', () => {
  it('renders basic markdown content correctly', () => {
    const markdownContent = '# Hello World\n\nThis is **bold** text.';
    render(<MarkdownPreview content={markdownContent} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World');
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('shows placeholder when content is empty and showPlaceholder is true', () => {
    render(<MarkdownPreview content="" showPlaceholder={true} />);
    
    expect(screen.getByText('Nothing to preview yet.')).toBeInTheDocument();
    expect(screen.getByText('Nothing to preview yet.')).toHaveClass('markdown-preview__placeholder');
  });

  it('shows custom placeholder text', () => {
    const customPlaceholder = 'Start typing to see preview...';
    render(<MarkdownPreview content="" placeholder={customPlaceholder} />);
    
    expect(screen.getByText(customPlaceholder)).toBeInTheDocument();
  });

  it('does not show placeholder when showPlaceholder is false', () => {
    render(<MarkdownPreview content="" showPlaceholder={false} />);
    
    expect(screen.queryByText('Nothing to preview yet.')).not.toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(<MarkdownPreview content="# Test" className="custom-class" />);
    
    const container = screen.getByText('Test').closest('.markdown-preview');
    expect(container).toHaveClass('markdown-preview', 'custom-class');
  });

  it('renders different markdown elements correctly', () => {
    const complexMarkdown = `
# Heading 1
## Heading 2

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2

> This is a blockquote

\`code\` and \`\`\`
code block
\`\`\`
    `;
    
    render(<MarkdownPreview content={complexMarkdown} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('Numbered item 1')).toBeInTheDocument();
  });

  it('converts line breaks correctly', () => {
    const contentWithBreaks = 'Line 1\nLine 2\nLine 3';
    render(<MarkdownPreview content={contentWithBreaks} />);
    
    // Check that the content is rendered inside a paragraph
    const paragraphElement = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes('Line 1');
    });
    expect(paragraphElement).toBeInTheDocument();
  });

  it('auto-converts URLs to links', () => {
    const contentWithUrl = 'Visit https://example.com for more info';
    render(<MarkdownPreview content={contentWithUrl} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('sanitizes HTML content for security', () => {
    const safeMarkdownContent = '# Safe Heading\n\nThis is safe content.';
    render(<MarkdownPreview content={safeMarkdownContent} />);
    
    expect(screen.getByRole('heading')).toHaveTextContent('Safe Heading');
  });

  it('allows safe HTML tags', () => {
    const safeHtmlContent = '**Bold text** and *italic text*';
    render(<MarkdownPreview content={safeHtmlContent} />);
    
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    render(<MarkdownPreview content={null} />);
    expect(screen.getByText('Nothing to preview yet.')).toBeInTheDocument();
  });

  it('handles undefined content', () => {
    render(<MarkdownPreview content={undefined} />);
    expect(screen.getByText('Nothing to preview yet.')).toBeInTheDocument();
  });

  it('applies markdown-preview class by default', () => {
    render(<MarkdownPreview content="# Test" />);
    
    const container = screen.getByText('Test').closest('.markdown-preview');
    expect(container).toHaveClass('markdown-preview');
  });

  it('renders content in markdown-preview__content wrapper', () => {
    render(<MarkdownPreview content="# Test Content" />);
    
    const contentWrapper = screen.getByText('Test Content').closest('.markdown-preview__content');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveClass('markdown-preview__content');
  });

  it('handles special characters in markdown', () => {
    const specialCharsContent = '# Test Heading';
    render(<MarkdownPreview content={specialCharsContent} />);
    
    expect(screen.getByRole('heading')).toHaveTextContent('Test Heading');
  });
});
