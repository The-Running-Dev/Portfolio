/**
 * @deprecated This file is deprecated. Use configLoader.ts instead.
 * 
 * GitHub Project Configuration System
 * 
 * This module has been replaced by the unified configuration loader to consolidate
 * parallel config systems and ensure single source of truth from YAML→JSON.
 * 
 * @fileoverview Legacy configuration module. All exports now delegate to
 * the unified configuration loader (configLoader.ts) for consistency.
 */

import { GitHubConfig } from './models';
import { 
  getGitHubConfig as getUnifiedConfig,
  getRepositoryInfo as getUnifiedRepositoryInfo,
  getGitHubUrls as getUnifiedGitHubUrls,
  getProjectMetadata as getUnifiedProjectMetadata
} from './configLoader';

/**
 * @deprecated Use getGitHubConfig from configLoader.ts instead
 * Get the complete GitHub configuration
 * @returns {GitHubConfig} Immutable GitHub configuration object
 */
export function getGitHubConfig(): GitHubConfig {
  return getUnifiedConfig();
}

/**
 * @deprecated Use getRepositoryInfo from configLoader.ts instead
 * Get repository information
 * @returns Repository information object
 */
export function getRepositoryInfo() {
  return getUnifiedRepositoryInfo();
}

/**
 * @deprecated Use getGitHubUrls from configLoader.ts instead
 * Get all GitHub URLs
 * @returns All GitHub URLs object
 */
export function getGitHubUrls() {
  return getUnifiedGitHubUrls();
}

/**
 * @deprecated Use getProjectMetadata from configLoader.ts instead
 * Get project metadata
 * @returns Project metadata object
 */
export function getProjectMetadata() {
  return getUnifiedProjectMetadata();
}

/**
 * @deprecated This function will be removed in a future version
 * Get specific GitHub URL by key
 * @param key - URL key to retrieve
 * @returns URL string
 */
export function getGitHubUrl(key: keyof GitHubConfig['urls']): string {
  const urls = getUnifiedGitHubUrls();
  return urls[key];
}

/**
 * @deprecated This function will be removed in a future version
 * Build repository URL with optional path
 * @param path - Optional path to append
 * @returns Repository URL
 */
export function getRepositoryUrl(path?: string): string {
  const urls = getUnifiedGitHubUrls();
  const baseUrl = urls.repository;
  
  if (!path) return baseUrl;
  
  // Handle different path formats
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * @deprecated This function will be removed in a future version
 * Build API URL with optional endpoint
 * @param endpoint - Optional API endpoint
 * @returns API URL
 */
export function getApiUrl(endpoint?: string): string {
  const urls = getUnifiedGitHubUrls();
  const baseUrl = urls.api;
  
  if (!endpoint) return baseUrl;
  
  // Handle different endpoint formats
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

// Default export for backward compatibility
const config = getUnifiedConfig();
export default config;
