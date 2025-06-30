import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth0 } from '@auth0/auth0-react';
import EntryPage from '../EntryPage';

// Create mock functions
const mockNavigate = vi.fn();
const mockGetAccessTokenSilently = vi.fn();

// Mock react-router-dom with edit mode params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }), // Edit mode with ID
  };
});

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

// Mock the API module
const mockApi = {
  entries: {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
  },
  executeWithState: vi.fn(),
};

vi.mock('../../utils/api', () => ({
  useApi: () => mockApi,
}));

// Mock components to simplify testing
vi.mock('../../components', () => ({
  Button: ({ children, onClick, type, variant, disabled, ...props }) => (
    <button 
      onClick={onClick} 
      type={type} 
      disabled={disabled}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
  MarkdownPreview: ({ content, placeholder, className }) => (
    <div className={className} data-testid="markdown-preview">
      {content || placeholder}
    </div>
  ),
}));

// Test wrapper component - simplified to just render the component directly
const TestWrapper = ({ children }) => children;

describe('EntryPage Component - Edit Mode', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock Auth0
    useAuth0.mockReturnValue({
      getAccessTokenSilently: mockGetAccessTokenSilently,
      isAuthenticated: true,
      isLoading: false,
    });

    // Reset executeWithState mock to default behavior
    mockApi.executeWithState.mockImplementation(async (apiCall, callbacks) => {
      try {
        callbacks.onStart?.();
        const result = await apiCall();
        callbacks.onSuccess?.(result);
        return result;
      } catch (error) {
        callbacks.onError?.(error);
        throw error;
      } finally {
        callbacks.onFinally?.();
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading Existing Entry', () => {
    it('renders edit entry form with correct title', async () => {
      const mockEntry = {
        id: '123',
        title: 'Existing Entry',
        date: '2025-06-28T00:00:00.000Z',
        description: 'Existing description',
      };

      mockApi.entries.getById.mockResolvedValue(mockEntry);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Entry')).toBeInTheDocument();
      });
    });

    it('shows loading state while fetching entry data', async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockApi.entries.getById.mockReturnValue(promise);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      expect(screen.getByText('Loading entry...')).toBeInTheDocument();

      resolvePromise({
        id: '123',
        title: 'Test Entry',
        date: '2025-06-28T00:00:00.000Z',
        description: 'Test description',
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading entry...')).not.toBeInTheDocument();
      });
    });

    it('loads and populates form with existing entry data', async () => {
      const mockEntry = {
        id: '123',
        title: 'Existing Entry',
        date: '2025-06-28T00:00:00.000Z',
        description: 'Existing description',
      };

      mockApi.entries.getById.mockResolvedValue(mockEntry);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Entry')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2025-06-28')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
      });

      expect(mockApi.entries.getById).toHaveBeenCalledWith('123');
    });

    it('handles entry loading errors gracefully', async () => {
      const error = new Error('Entry not found');
      
      mockApi.executeWithState.mockImplementation(async (apiCall, callbacks) => {
        callbacks.onStart?.();
        callbacks.onError?.(error);
        callbacks.onFinally?.();
        // Don't throw here since we're calling onError
      });

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Entry not found')).toBeInTheDocument();
      });
    });

    it('handles entry with missing date gracefully', async () => {
      const mockEntry = {
        id: '123',
        title: 'Test Entry',
        date: null, // Missing date
        description: 'Test description',
      };

      mockApi.entries.getById.mockResolvedValue(mockEntry);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const dateInput = screen.getByLabelText('Date');
        // Should default to today's date when entry date is missing
        const today = new Date().toISOString().split('T')[0];
        expect(dateInput.value).toBe(today);
      });
    });

    it('handles entry with missing fields gracefully', async () => {
      const mockEntry = {
        id: '123',
        title: null,
        date: null,
        description: null,
      };

      mockApi.entries.getById.mockResolvedValue(mockEntry);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('');
        expect(screen.getByLabelText('Description')).toHaveValue('');
      });
    });
  });

  describe('Updating Entry', () => {
    beforeEach(() => {
      // Set up default mock entry for update tests
      const mockEntry = {
        id: '123',
        title: 'Original Title',
        date: '2025-06-28T00:00:00.000Z',
        description: 'Original description',
      };
      mockApi.entries.getById.mockResolvedValue(mockEntry);
    });

    it('shows Update button text in edit mode', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Update')).toBeInTheDocument();
      });
    });

    it('updates entry successfully on form submission', async () => {
      const updatedEntry = {
        id: '123',
        title: 'Updated Title',
        date: '2025-06-29',
        description: 'Updated description',
      };

      mockApi.entries.update.mockResolvedValue(updatedEntry);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
      });

      // Update form fields
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
      fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-06-29' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated description' } });

      // Submit form
      fireEvent.click(screen.getByText('Update'));

      await waitFor(() => {
        expect(mockApi.executeWithState).toHaveBeenCalled();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('handles form input changes correctly in edit mode', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load with existing data
      await waitFor(() => {
        expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText('Title');
      const dateInput = screen.getByLabelText('Date');
      const descriptionInput = screen.getByLabelText('Description');

      // Verify initial values
      expect(titleInput.value).toBe('Original Title');
      expect(dateInput.value).toBe('2025-06-28');
      expect(descriptionInput.value).toBe('Original description');

      // Update values
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      fireEvent.change(dateInput, { target: { value: '2025-06-30' } });
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      // Verify updated values
      expect(titleInput.value).toBe('New Title');
      expect(dateInput.value).toBe('2025-06-30');
      expect(descriptionInput.value).toBe('New description');
    });

    it('preserves existing data when only some fields are changed', async () => {
      const updatedEntry = {
        id: '123',
        title: 'Updated Title Only',
        date: '2025-06-28',
        description: 'Original description',
      };

      mockApi.entries.update.mockResolvedValue(updatedEntry);

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
      });

      // Only update the title
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title Only' } });

      // Submit form
      fireEvent.click(screen.getByText('Update'));

      await waitFor(() => {
        expect(mockApi.executeWithState).toHaveBeenCalled();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates back when back button is clicked in edit mode', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Back'));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Edit Mode Preview', () => {
    beforeEach(() => {
      // Set up default mock entry for preview tests
      const mockEntry = {
        id: '123',
        title: 'Test Entry',
        date: '2025-06-28T00:00:00.000Z',
        description: '# Original Markdown\nThis is the original content.',
      };
      mockApi.entries.getById.mockResolvedValue(mockEntry);
    });

    it('toggles between edit and preview modes with existing content', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        const descriptionTextarea = screen.getByLabelText('Description');
        expect(descriptionTextarea.value.trim()).toContain('# Original Markdown');
        expect(descriptionTextarea.value.trim()).toContain('This is the original content.');
      });

      const previewToggle = screen.getByText('Preview');
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.queryByTestId('markdown-preview')).not.toBeInTheDocument();

      fireEvent.click(previewToggle);

      expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('shows existing content in preview mode', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        const descriptionTextarea = screen.getByLabelText('Description');
        expect(descriptionTextarea.value.trim()).toContain('# Original Markdown');
      });

      // Switch to preview
      fireEvent.click(screen.getByText('Preview'));

      // Check that existing content is displayed in preview
      const previewElement = screen.getByTestId('markdown-preview');
      expect(previewElement).toBeInTheDocument();
      expect(previewElement).toHaveTextContent('# Original Markdown');
      expect(previewElement).toHaveTextContent('This is the original content.');
    });

    it('shows updated content in preview after editing', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        const descriptionTextarea = screen.getByLabelText('Description');
        expect(descriptionTextarea.value.trim()).toContain('# Original Markdown');
      });

      // Update the description
      fireEvent.change(screen.getByLabelText('Description'), { 
        target: { value: '# Updated Markdown\nThis is the updated content.' } 
      });

      // Switch to preview
      fireEvent.click(screen.getByText('Preview'));

      // Check that updated content is displayed in preview
      const previewElement = screen.getByTestId('markdown-preview');
      expect(previewElement).toBeInTheDocument();
      expect(previewElement).toHaveTextContent('# Updated Markdown');
      expect(previewElement).toHaveTextContent('This is the updated content.');
    });

    it('switches back to edit mode from preview in edit mode', async () => {
      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      // Wait for form to load
      await waitFor(() => {
        const descriptionTextarea = screen.getByLabelText('Description');
        expect(descriptionTextarea.value.trim()).toContain('# Original Markdown');
      });

      // Go to preview mode
      fireEvent.click(screen.getByText('Preview'));
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();

      // Go back to edit mode
      fireEvent.click(screen.getByText('Edit'));
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.queryByTestId('markdown-preview')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling in Edit Mode', () => {
    it('displays error message when entry loading fails', async () => {
      const error = { message: 'Network error occurred' };
      
      mockApi.executeWithState.mockImplementation(async (apiCall, callbacks) => {
        callbacks.onStart?.();
        callbacks.onError?.(error);
        callbacks.onFinally?.();
        // Don't throw here since we're calling onError
      });

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Network error occurred')).toBeInTheDocument();
      });
    });

    it('displays generic error message when error has no message', async () => {
      const error = {};
      
      mockApi.executeWithState.mockImplementation(async (apiCall, callbacks) => {
        callbacks.onStart?.();
        callbacks.onError?.(error);
        callbacks.onFinally?.();
        // Don't throw here since we're calling onError
      });

      render(
        <TestWrapper>
          <EntryPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load entry. Please try again.')).toBeInTheDocument();
      });
    });
  });
});
