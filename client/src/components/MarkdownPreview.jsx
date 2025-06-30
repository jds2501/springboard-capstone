import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
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
    html: false, // Disable HTML for security
    linkify: true, // Auto-convert URLs to links
    typographer: true // Enable smart quotes and other typographic replacements
  }), []);

  // Render markdown content
  const renderedContent = useMemo(() => {
    return content ? md.render(content) : '';
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
