import { useState, useEffect, useCallback } from 'react';
import { useFeatureFlag } from '../config/FeaturesConfig';
import { Features } from '../config/FeaturesConfig';

/**
 * API Hook Configuration
 */
export interface UseApiConfig {
  /** Whether to enable API data fetching (disabled by default) */
  enabled?: boolean;
  /** API endpoint URL */
  endpoint?: string;
  /** Request options */
  options?: RequestInit;
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Retry attempts on failure */
  retryAttempts?: number;
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * API Hook State
 */
export interface UseApiState<T = any> {
  /** API response data */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Whether API is enabled */
  enabled: boolean;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
  /** Reset state */
  reset: () => void;
}

/**
 * Default API configuration
 */
const DEFAULT_CONFIG: Required<UseApiConfig> = {
  enabled: false, // Disabled by default
  endpoint: '',
  options: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  autoFetch: true,
  retryAttempts: 3,
  retryDelay: 1000
};

/**
 * Hook for fetching project data from an API
 * Disabled by default and respects feature flags
 *
 * @param config - API configuration
 * @returns API state and actions
 *
 * @example
 * ```tsx
 * // Basic usage (disabled by default)
 * const { data, loading, error, enabled } = useApi({
 *   endpoint: '/api/projects'
 * });
 *
 * // Explicitly enabled
 * const { data, loading, error, refetch } = useApi({
 *   enabled: true,
 *   endpoint: '/api/projects',
 *   autoFetch: true
 * });
 *
 * // Manual fetch with retry
 * const { data, refetch, reset } = useApi({
 *   enabled: true,
 *   endpoint: '/api/projects',
 *   autoFetch: false,
 *   retryAttempts: 5,
 *   retryDelay: 2000
 * });
 * ```
 */
export function useApi<T = any>(config: UseApiConfig = {}): UseApiState<T> {
  // Check if API data fetching feature is enabled globally
  const isApiFeatureEnabled = useFeatureFlag(Features.ApiDataFetching);

  // Merge config with defaults
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Determine if API should be enabled (both feature flag and config must be true)
  const isEnabled = isApiFeatureEnabled && mergedConfig.enabled;

  // State management
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch data with retry logic
   */
  const fetchData = useCallback(
    async (attempt: number = 1): Promise<void> => {
      if (!isEnabled || !mergedConfig.endpoint) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          mergedConfig.endpoint,
          mergedConfig.options
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Unknown API error');

        // Retry logic
        if (attempt < mergedConfig.retryAttempts) {
          console.warn(
            `API fetch attempt ${attempt} failed, retrying in ${mergedConfig.retryDelay}ms...`,
            error.message
          );

          setTimeout(() => {
            fetchData(attempt + 1);
          }, mergedConfig.retryDelay);

          return;
        }

        // Max retries reached
        console.error(
          'API fetch failed after all retry attempts:',
          error.message
        );
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [
      isEnabled,
      mergedConfig.endpoint,
      mergedConfig.options,
      mergedConfig.retryAttempts,
      mergedConfig.retryDelay
    ]
  );

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchData(1);
  }, [fetchData]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (isEnabled && mergedConfig.autoFetch && mergedConfig.endpoint) {
      fetchData(1);
    }
  }, [isEnabled, mergedConfig.autoFetch, mergedConfig.endpoint, fetchData]);

  return {
    data,
    loading,
    error,
    enabled: isEnabled,
    refetch,
    reset
  };
}

/**
 * Hook specifically for fetching project data from an API
 * Pre-configured for project data structure
 */
export function useApiProjects(
  config: Omit<UseApiConfig, 'endpoint'> & { endpoint?: string } = {}
) {
  return useApi({
    endpoint: '/api/projects',
    ...config
  });
}

export default useApi;
