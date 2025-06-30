import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import './MarkdownPreview.css';

/**
 * MarkdownPreview Component
 * 
 * A reusable component for rendering markdown content with consistent styling.
 * 
 * @param {string} content - The markdown content to render
 * @param {string} className - Additional CSS classes to apply
 * @param {string} placeholder - Text to show when content is empty
 * @param {boolean} showPlaceholder - Whether to show placeholder when content is empty
 * 
 * Usage examples:
 * 
 * // Basic usage for previewing user input
 * <MarkdownPreview content={userInput} />
 * 
 * // Read-only display without border/background
 * <MarkdownPreview 
 *   content={entry.description} 
 *   className="markdown-preview--readonly"
 *   showPlaceholder={false}
 * />
 * 
 * // Compact version without minimum height
 * <MarkdownPreview 
 *   content={entry.description} 
 *   className="markdown-preview--compact" 
 * />
 */
const MarkdownPreview = ({ 
  content = '', 
  className = '',
  placeholder = 'Nothing to preview yet.',
  showPlaceholder = true 
}) => {
  // Initialize markdown parser with consistent settings
  const md = useMemo(() => new MarkdownIt({
    html: false, // Disable HTML parsing for additional security
    linkify: true, // Auto-convert URLs to links
    typographer: true, // Enable smart quotes and other typographic replacements
    breaks: true // Convert single line breaks to <br> tags for better formatting
  }), []);

  // Render and sanitize markdown content
  const renderedContent = useMemo(() => {
    if (!content) return '';
    
    const htmlContent = md.render(content);
    
    // Sanitize HTML to prevent XSS attacks
    return sanitizeHtml(htmlContent, {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 'del',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'a', 'img'
      ],
      allowedAttributes: {
        'a': ['href', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height']
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesByTag: {
        'img': ['http', 'https', 'data']
      }
    });
  }, [content, md]);

  const containerClass = `markdown-preview ${className}`.trim();

  return (
    <div className={containerClass}>
      {renderedContent ? (
        <div 
          className="markdown-preview__content"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      ) : (
        showPlaceholder && (
          <p className="markdown-preview__placeholder">
            {placeholder}
          </p>
        )
      )}
    </div>
  );
};

export default MarkdownPreview;
