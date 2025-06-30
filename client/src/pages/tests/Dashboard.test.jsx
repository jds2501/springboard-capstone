import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from '../Dashboard';

// Create mock functions
const mockLogout = vi.fn();
const mockGetAccessTokenSilently = vi.fn();
const mockGoToAddEntry = vi.fn();
const mockGoToTrend = vi.fn();
const mockGoToPreviewEntry = vi.fn();

// Mock Auth0
vi.mock('@auth0/auth0-react');

// Mock navigation hook
vi.mock('../../routes', () => ({
  useAppNavigation: () => ({
    goToAddEntry: mockGoToAddEntry,
    goToTrend: mockGoToTrend,
    goToPreviewEntry: mockGoToPreviewEntry,
  }),
}));

// Mock API
const mockApi = {
  users: {
    findOrCreate: vi.fn(),
  },
  entries: {
    getAll: vi.fn(),
    import: vi.fn(),
  },
};

vi.mock('../../utils/api', () => ({
  useApi: () => mockApi,
}));

// Mock components
vi.mock('../../components', () => ({
  Button: ({ children, onClick, disabled, ...props }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
  JournalEntry: ({ entry, onEntryClick }) => (
    <div 
      data-testid="journal-entry" 
      data-entry-id={entry.id}
      onClick={() => onEntryClick?.(entry)}
    >
      <h3>{entry.title}</h3>
      <p>{entry.content}</p>
    </div>
  ),
  Spinner: () => (
    <div data-testid="spinner">Loading...</div>
  ),
}));

describe('Dashboard Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockEntries = [
    {
      id: 1,
      title: 'First Entry',
      content: 'Content 1',
      date: '2025-06-25',
      mood: 'happy',
    },
    {
      id: 2,
      title: 'Second Entry',
      content: 'Content 2',
      date: '2025-06-26',
      mood: 'neutral',
    },
  ];

  const mockPagination = {
    page: 1,
    limit: 6,
    totalPages: 1,
    totalResults: 2,
  };

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Setup Auth0 mock
    useAuth0.mockReturnValue({
      logout: mockLogout,
      user: mockUser,
      getAccessTokenSilently: mockGetAccessTokenSilently,
      isAuthenticated: true,
      isLoading: false,
    });

    // Setup API mocks with resolved promises
    mockApi.users.findOrCreate.mockResolvedValue({ id: 1, email: mockUser.email });
    mockApi.entries.getAll.mockResolvedValue({
      entries: mockEntries,
      pagination: mockPagination,
    });
    mockApi.entries.import.mockResolvedValue({ id: 4, title: 'Imported Entry' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders dashboard with user name in title', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      expect(screen.getByText("John Doe's Journal")).toBeInTheDocument();
    });

    it('renders all action buttons', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      expect(screen.getByText('Add')).toBeInTheDocument();
      expect(screen.getByText('Import')).toBeInTheDocument();
      expect(screen.getByText('Trend')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('renders dashboard with default title when user name is not available', async () => {
      useAuth0.mockReturnValue({
        logout: mockLogout,
        user: { email: 'john@example.com' }, // No name property
        getAccessTokenSilently: mockGetAccessTokenSilently,
        isAuthenticated: true,
        isLoading: false,
      });

      await act(async () => {
        render(<Dashboard />);
      });
      
      expect(screen.getByText("Jason's Journal")).toBeInTheDocument();
    });
  });

  describe('Authentication Integration', () => {
    it('calls logout when logout button is clicked', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      }, { timeout: 1000 });

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('initializes API calls on mount', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      // Give time for useEffect to run
      await waitFor(() => {
        expect(mockApi.users.findOrCreate).toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('Navigation Integration', () => {
    it('navigates to add entry when Add button is clicked', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Add')).toBeInTheDocument();
      }, { timeout: 1000 });

      const addButton = screen.getByText('Add');
      fireEvent.click(addButton);
      
      expect(mockGoToAddEntry).toHaveBeenCalledTimes(1);
    });

    it('navigates to trend page when Trend button is clicked', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Trend')).toBeInTheDocument();
      }, { timeout: 1000 });

      const trendButton = screen.getByText('Trend');
      fireEvent.click(trendButton);
      
      expect(mockGoToTrend).toHaveBeenCalledTimes(1);
    });
  });

  describe('Entries Display', () => {
    it('displays entries after loading', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('First Entry')).toBeInTheDocument();
        expect(screen.getByText('Second Entry')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('handles empty entries list', async () => {
      mockApi.entries.getAll.mockResolvedValue({
        entries: [],
        pagination: { ...mockPagination, totalResults: 0 },
      });

      await act(async () => {
        render(<Dashboard />);
      });
      
      await waitFor(() => {
        expect(screen.getByText('No journal entries yet. Start by adding your first entry!')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Component Cleanup', () => {
    it('unmounts without errors', async () => {
      const { unmount } = await act(async () => {
        return render(<Dashboard />);
      });
      expect(() => unmount()).not.toThrow();
    });
  });
});
