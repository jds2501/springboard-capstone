/**
 * API utilities for making authenticated requests to the backend
 */
import { useState } from "react";

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
};

/**
 * Creates an authenticated API client with common functionality
 * @param {Function} getAccessTokenSilently - Auth0 function to get access token
 * @returns {Object} API client with request methods
 */
export function createApiClient(getAccessTokenSilently) {
  /**
   * Makes an authenticated request to the API
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} options - Fetch options
   * @returns {Promise} Response data or throws error
   */
  async function request(endpoint, options = {}) {
    try {
      // Get the access token
      const token = await getAccessTokenSilently({
        audience: API_CONFIG.audience,
      });

      // Prepare the URL
      const url = `${API_CONFIG.baseURL}${endpoint}`;

      // Default headers
      const defaultHeaders = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Merge with provided options
      const config = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      // Make the request
      const response = await fetch(url, config);

      // Handle response
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error ||
            errorData.message ||
            `Request failed with status ${response.status}`;
        } catch {
          errorMessage = `Request failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Return the response data
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  return {
    // Generic request method
    request,

    // Convenience methods for common HTTP verbs
    get: (endpoint, options = {}) =>
      request(endpoint, { ...options, method: "GET" }),

    post: (endpoint, data, options = {}) =>
      request(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      }),

    patch: (endpoint, data, options = {}) =>
      request(endpoint, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (endpoint, options = {}) =>
      request(endpoint, { ...options, method: "DELETE" }),

    // Specific API methods for entries
    entries: {
      create: (entryData) =>
        request("/entries", {
          method: "POST",
          body: JSON.stringify(entryData),
        }),

      getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/entries?${queryString}` : "/entries";
        return request(endpoint, { method: "GET" });
      },

      getById: (id) => request(`/entries/${id}`, { method: "GET" }),

      update: (id, entryData) =>
        request(`/entries/${id}`, {
          method: "PATCH",
          body: JSON.stringify(entryData),
        }),

      delete: (id) => request(`/entries/${id}`, { method: "DELETE" }),

      analyzeTrend: (dateRange) =>
        request("/entries/trend", {
          method: "POST",
          body: JSON.stringify(dateRange),
        }),

      import: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return request("/entries/import", {
          method: "POST",
          headers: {}, // Let fetch set the content-type for FormData
          body: formData,
        });
      },
    },

    // User API methods
    users: {
      findOrCreate: () => request("/users", { method: "POST" }),
    },
  };
}

/**
 * Custom hook for API operations with loading and error state management
 * @param {Function} getAccessTokenSilently - Auth0 function to get access token
 * @returns {Object} API utilities with state management
 */
export function useApi(getAccessTokenSilently) {
  const api = createApiClient(getAccessTokenSilently);

  /**
   * Executes an API operation with automatic loading and error state management
   * @param {Function} apiOperation - Function that returns a promise
   * @param {Object} options - Options for the operation
   * @returns {Promise} Result of the API operation
   */
  async function executeWithState(apiOperation, options = {}) {
    const {
      onStart = () => {},
      onSuccess = () => {},
      onError = () => {},
      onFinally = () => {},
    } = options;

    try {
      onStart();
      const result = await apiOperation();
      onSuccess(result);
      return result;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      onFinally();
    }
  }

  return {
    ...api,
    executeWithState,
  };
}

/**
 * Custom hook for managing API operation state (loading, error, data)
 * @returns {Object} State management utilities
 */
export function useApiState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (apiOperation) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiOperation();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
  };

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
    setError,
    setData,
  };
}
