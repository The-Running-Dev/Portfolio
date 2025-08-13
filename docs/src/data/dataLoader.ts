/**
 * Global Cache Configuration
 * Controls caching behavior across the entire data loading system
 */
export const DataCacheConfig = {
  /** Global cache enable/disable flag */
  enabled: false,
  
  /** Clear all cached data */
  clear(): void {
    dataCache.clear();
  },
  
  /** Get current cache size */
  size(): number {
    return dataCache.size;
  },
  
  /** 
   * Set the global cache state from features configuration
   * This method should be called during app initialization
   */
  setFromFeatures(enableDataCaching: boolean): void {
    this.enabled = enableDataCaching;
  },
  
  /** Check if caching is enabled and environment allows it */
  isEnabled(): boolean {
    // Disable caching in development for fresh data
    const isDevelopment = process.env.NODE_ENV === 'development';
    return this.enabled && !isDevelopment;
  }
} as const;

/**
 * Options for on-demand data loading
 */
interface GetDataOptions<T> {
  /** Enable/disable caching for this specific call (overrides global setting) */
  cache?: boolean;

  /** Optional processor function to transform the data */
  processor?: (data: any) => T;
}

/**
 * Cache for on-demand data loading (when caching is enabled)
 */
const dataCache = new Map<any, any>();

/**
 * Process raw data on-demand with optional caching and transformation
 * 
 * @param rawData - Raw JSON data to process
 * @param options - Processing options (cache, processor)
 * @returns Typed and processed data
 * 
 * @example
 * // Basic usage with imported data
 * const config = getData<VersionConfig>(versionConfigJson);
 * 
 * // With custom processor
 * const processedData = getData(rawData, { 
 *   processor: (data) => transformToSpecialFormat(data) 
 * });
 * 
 * // Force caching even when globally disabled
 * const cachedData = getData(rawData, { cache: true });
 * 
 * // Force no caching even when globally enabled
 * const freshData = getData(rawData, { cache: false });
 */
export function getData<T = any>(
  rawData: any,
  options: GetDataOptions<T> = {}
): T {
  // Determine if caching should be used:
  // 1. If cache is explicitly set in options, use that
  // 2. Otherwise, use global cache configuration
  const shouldCache = options.cache !== undefined 
    ? options.cache 
    : DataCacheConfig.isEnabled();
    
  const { processor } = options;

  // Check cache first if caching is enabled
  if (shouldCache && dataCache.has(rawData)) {
    return dataCache.get(rawData) as T;
  }

  // Process the raw data
  let result: T = rawData as T;

  if (processor) {
    result = processor(rawData);
  }

  // Cache the result if caching is enabled
  if (shouldCache) {
    dataCache.set(rawData, result);
  }

  return result;
}