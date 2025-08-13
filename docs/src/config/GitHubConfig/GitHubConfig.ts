import { GitHubConfig } from './models';

/**
 * GitHub Project Configuration System
 * 
 * Centralized configuration for managing GitHub project metadata that serves as a 
 * single source of truth for all GitHub-related information across the project.
 * 
 * @fileoverview This configuration provides strongly-typed, immutable access to
 * repository information, project metadata, reference URLs, and integration endpoints.
 */

// Immutable configuration object
const gitHubConfig: Readonly<GitHubConfig> = Object.freeze({
  repo: "The-Running-Dev/Portfolio",
  organization: "The-Running-Dev", 
  project: "Portfolio",
  urls: Object.freeze({
    repository: "https://github.com/The-Running-Dev/Portfolio",
    issues: "https://github.com/The-Running-Dev/Portfolio/issues",
    discussions: "https://github.com/The-Running-Dev/Portfolio/discussions",
    docs: "https://github.com/The-Running-Dev/Portfolio#readme",
    pages: "https://portfolio.subzerodev.com",
    packages: "https://github.com/The-Running-Dev/Portfolio/packages",
    api: "https://api.github.com/repos/The-Running-Dev/Portfolio",
    contributors: "https://github.com/The-Running-Dev/Portfolio/contributors",
    releases: "https://github.com/The-Running-Dev/Portfolio/releases", 
    pulls: "https://github.com/The-Running-Dev/Portfolio/pulls",
    actions: "https://github.com/The-Running-Dev/Portfolio/actions",
    readme: "https://github.com/The-Running-Dev/Portfolio/blob/main/README.md",
    avatar: "https://github.com/The-Running-Dev.png"
  }),
  metadata: Object.freeze({
    defaultBranch: "main",
    license: "MIT",
    topics: Object.freeze(["docusaurus", "portfolio", "typescript", "documentation", "react", "template"]),
    description: "A modern, type-safe Docusaurus portfolio and documentation template."
  })
});

/**
 * Get the complete GitHub configuration
 * @returns {GitHubConfig} Immutable GitHub configuration object
 */
export function getGitHubConfig(): GitHubConfig {
  return gitHubConfig;
}

/**
 * Get repository information
 * @returns Repository name in owner/repo format, organization, and project name
 */
export function getRepositoryInfo() {
  return {
    repo: gitHubConfig.repo,
    organization: gitHubConfig.organization,
    project: gitHubConfig.project
  };
}

/**
 * Get all GitHub URLs
 * @returns Object containing all GitHub-related URLs
 */
export function getGitHubUrls() {
  return gitHubConfig.urls;
}

/**
 * Get project metadata
 * @returns Project metadata including branch, license, topics, and description
 */
export function getProjectMetadata() {
  return gitHubConfig.metadata;
}

/**
 * Get a specific URL by key
 * @param urlKey - Key for the URL to retrieve
 * @returns The requested URL or undefined if not found
 */
export function getGitHubUrl(urlKey: keyof GitHubConfig['urls']): string {
  return gitHubConfig.urls[urlKey];
}

/**
 * Get repository URL with optional path
 * @param path - Optional path to append to repository URL
 * @returns Full GitHub repository URL with optional path
 */
export function getRepositoryUrl(path?: string): string {
  const baseUrl = gitHubConfig.urls.repository;
  return path ? `${baseUrl}${path.startsWith('/') ? path : `/${path}`}` : baseUrl;
}

/**
 * Get API URL with optional endpoint
 * @param endpoint - Optional API endpoint to append
 * @returns Full GitHub API URL with optional endpoint
 */
export function getApiUrl(endpoint?: string): string {
  const baseUrl = gitHubConfig.urls.api;
  return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}` : baseUrl;
}

// Default export for convenience
export default gitHubConfig;