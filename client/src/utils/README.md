# API Utilities

This module provides reusable utilities for making authenticated API calls to the backend server.

## Overview

The API utilities handle:

- Authentication with Auth0 JWT tokens
- Request/response handling
- Error management
- Common HTTP methods
- Domain-specific API operations

## Usage

### Basic Setup

```jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../utils/api";

function MyComponent() {
  const { getAccessTokenSilently } = useAuth0();
  const api = useApi(getAccessTokenSilently);

  // Now you can use api methods...
}
```

### API Methods

#### Generic HTTP Methods

```jsx
// GET request
const data = await api.get("/entries");

// POST request
const newEntry = await api.post("/entries", {
  title: "Test",
  description: "Content",
});

// PATCH request
const updatedEntry = await api.patch("/entries/123", { title: "Updated" });

// DELETE request
await api.delete("/entries/123");
```

#### Entry-Specific Methods

```jsx
// Create an entry
const newEntry = await api.entries.create({
  title: "My Entry",
  date: "2024-01-01",
  description: "Entry content",
});

// Get all entries with pagination
const result = await api.entries.getAll({ page: 1, limit: 20 });

// Get single entry
const entry = await api.entries.getById("123");

// Update entry
const updated = await api.entries.update("123", { title: "New Title" });

// Delete entry
await api.entries.delete("123");

// Analyze trends
const analysis = await api.entries.analyzeTrend({
  from: "2024-01-01",
  to: "2024-12-31",
});

// Import file
const imported = await api.entries.import(file);
```

#### User Methods

```jsx
// Find or create user
const user = await api.users.findOrCreate();
```

### State Management Options

#### Option 1: Manual State Management with executeWithState

```jsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const handleAction = async () => {
  await api.executeWithState(() => api.entries.create(entryData), {
    onStart: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (result) => {
      console.log("Success:", result);
      // Handle success
    },
    onError: (err) => {
      setError(err.message);
    },
    onFinally: () => {
      setIsLoading(false);
    },
  });
};
```

#### Option 2: Using useApiState Hook

```jsx
import { useApiState } from "../utils/api";

const { isLoading, error, data, execute } = useApiState();

const handleAction = async () => {
  try {
    const result = await execute(() => api.entries.create(entryData));
    // Handle success
  } catch (err) {
    // Error is automatically stored in error state
  }
};
```

#### Option 3: Direct API Calls

```jsx
const handleAction = async () => {
  try {
    const result = await api.entries.create(entryData);
    // Handle success
  } catch (error) {
    // Handle error manually
  }
};
```

## Error Handling

All API methods automatically:

- Handle authentication token retrieval
- Parse error responses from the server
- Throw meaningful error messages
- Log errors to the console

## Configuration

API configuration is handled via environment variables:

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_AUTH0_AUDIENCE` - Auth0 audience for token requests

## File Upload

For file uploads (like importing entries), the API automatically handles FormData:

```jsx
const handleFileUpload = async (file) => {
  try {
    const result = await api.entries.import(file);
    console.log("File imported:", result);
  } catch (error) {
    console.error("Import failed:", error);
  }
};
```

## Testing Benefits

One of the major advantages of this API architecture is how it enables **easy, fast, and reliable testing** without depending on actual API calls.

### Key Testing Benefits

#### 🚀 **Fast & Reliable Tests**

- No network dependencies
- Tests run in milliseconds
- No flaky tests due to network issues
- Works offline

#### 🎯 **Easy Mocking**

```jsx
// Mock the entire API for testing
vi.mock("../utils/api", () => ({
  useApi: vi.fn(),
}));

test("should create entry successfully", async () => {
  const mockApi = {
    executeWithState: vi.fn().mockImplementation(async (apiCall, callbacks) => {
      callbacks.onStart();
      const result = { id: 1, title: "Test Entry" };
      callbacks.onSuccess(result);
      callbacks.onFinally();
      return result;
    }),
  };

  useApi.mockReturnValue(mockApi);

  // Test your component...
});
```

#### 🧪 **Test Different Scenarios**

```jsx
// Test error scenarios
mockApi.entries.create.mockRejectedValue(new Error("Network error"));

// Test loading states
mockApi.executeWithState.mockImplementation(async (apiCall, callbacks) => {
  callbacks.onStart(); // Triggers loading state
  // ... simulate delay or success/error
});

// Test different data responses
mockApi.entries.getAll.mockResolvedValue({
  entries: [],
  pagination: { page: 1, totalPages: 0 },
});
```

#### 🔍 **Isolated Unit Testing**

- Test components without API implementation details
- Test API client without UI concerns
- Test business logic separately from network logic

#### 📊 **State Management Testing**

```jsx
// Test all loading states
test("shows loading spinner during API call", async () => {
  // Mock API to simulate loading
  render(<EntryPage />);
  fireEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(screen.getByText("Saving...")).toBeInTheDocument();
});

// Test error states
test("shows error message on API failure", async () => {
  // Mock API to return error
  // Verify error message is displayed
});
```

#### 🔄 **Refactoring Safety**

- Change API implementation without breaking tests
- Modify UI without affecting API tests
- Confident refactoring with test coverage

### Testing Patterns

#### Pattern 1: Component Testing

```jsx
// Focus on user interactions and UI behavior
test("user can create an entry", async () => {
  const mockApi = createMockApi();
  useApi.mockReturnValue(mockApi);

  render(<EntryPage />);

  // User fills form
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "My Entry" },
  });

  // User submits
  fireEvent.click(screen.getByRole("button", { name: /add/i }));

  // Verify API was called correctly
  expect(mockApi.entries.create).toHaveBeenCalledWith({
    title: "My Entry",
    // ...
  });
});
```

#### Pattern 2: API Client Testing

```jsx
// Focus on API contract and error handling
test("API client handles authentication", async () => {
  const mockAuth = vi.fn().mockResolvedValue("token");
  const api = createApiClient(mockAuth);

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1 }),
  });

  await api.entries.create({ title: "Test" });

  expect(fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: "Bearer token",
      }),
    })
  );
});
```

#### Pattern 3: Integration Testing

```jsx
// Use MSW (Mock Service Worker) for realistic API mocking
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.post("/api/entries", (req, res, ctx) => {
    return res(ctx.json({ id: 1, title: "Created" }));
  })
);

test("full user flow works end-to-end", async () => {
  // Test complete user interactions with realistic API responses
});
```

### vs Traditional Approach

#### ❌ Without API Utilities

```jsx
// Hard to test - tightly coupled to fetch implementation
test("creates entry", async () => {
  // Need to mock fetch globally
  // Hard to test different error scenarios
  // Brittle tests that break when API changes
  global.fetch = vi.fn().mockImplementation(/* complex mock setup */);

  // Test becomes about fetch implementation, not business logic
});
```

#### ✅ With API Utilities

```jsx
// Easy to test - focused on behavior
test("creates entry", async () => {
  const mockApi = { entries: { create: vi.fn().mockResolvedValue({}) } };
  useApi.mockReturnValue(mockApi);

  // Test focuses on user behavior and business logic
  // API implementation details are abstracted away
});
```

This architecture makes your tests **faster**, **more reliable**, and **easier to maintain**!
