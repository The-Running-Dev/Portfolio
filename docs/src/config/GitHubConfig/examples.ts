/**
 * GitHub Configuration Usage Examples
 * 
 * This file demonstrates common usage patterns for the GitHub Configuration System.
 * Use these examples as reference for integrating the configuration into your components.
 */

import {
  getGitHubConfig,
  getRepositoryInfo,
  getGitHubUrls,
  getProjectMetadata,
  getRepositoryUrl,
  getApiUrl
} from './GitHubConfig';
import { validateGitHubConfig } from './validation';

// =============================================================================
// Example 1: Badge System Integration
// =============================================================================

/**
 * Generate badge URLs using GitHub configuration
 */
export function createProjectBadges() {
  const { repo } = getRepositoryInfo();
  const { repository, releases } = getGitHubUrls();
  const { license, topics } = getProjectMetadata();

  return {
    // License badge
    license: {
      alt: `License: ${license}`,
      src: `https://img.shields.io/badge/license-${license}-blue.svg`,
      link: `${repository}/blob/main/LICENSE`
    },
    
    // GitHub repo badge
    github: {
      alt: 'GitHub Repository',
      src: `https://img.shields.io/github/stars/${repo}?style=social`,
      link: repository
    },
    
    // Release badge
    version: {
      alt: 'Latest Release',
      src: `https://img.shields.io/github/v/release/${repo}`,
      link: releases
    },
    
    // Topics badges
    topics: topics.map(topic => ({
      alt: topic,
      src: `https://img.shields.io/badge/topic-${topic}-lightgrey.svg`,
      link: `https://github.com/topics/${topic}`
    }))
  };
}

// =============================================================================
// Example 2: Navigation Links
// =============================================================================

/**
 * Generate navigation links for header/footer
 */
export function createNavigationLinks() {
  const urls = getGitHubUrls();
  
  return {
    primary: [
      { href: urls.repository, label: 'Source Code', external: true },
      { href: urls.docs, label: 'Documentation', external: true },
      { href: urls.pages, label: 'Live Demo', external: true }
    ],
    secondary: [
      { href: urls.issues, label: 'Report Issues', external: true },
      { href: urls.discussions, label: 'Discussions', external: true },
      { href: urls.releases, label: 'Releases', external: true }
    ],
    footer: [
      { href: urls.contributors, label: 'Contributors', external: true },
      { href: urls.actions, label: 'CI/CD Status', external: true }
    ]
  };
}

// =============================================================================
// Example 3: Giscus Comments Configuration
// =============================================================================

/**
 * Configure Giscus comments system
 */
export function createGiscusConfig() {
  const { repo } = getRepositoryInfo();
  
  return {
    repo,
    repoId: 'YOUR_REPO_ID', // This would be fetched from GitHub API
    category: 'General',
    categoryId: 'YOUR_CATEGORY_ID', // This would be fetched from GitHub API
    mapping: 'pathname',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lang: 'en'
  };
}

// =============================================================================
// Example 4: API Integration
// =============================================================================

/**
 * Fetch repository information from GitHub API
 */
export async function fetchRepositoryData() {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updated: data.updated_at,
      topics: data.topics
    };
  } catch (error) {
    console.error('Failed to fetch repository data:', error);
    return null;
  }
}

/**
 * Fetch latest release information
 */
export async function fetchLatestRelease() {
  const apiUrl = getApiUrl('/releases/latest');
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return {
      tagName: data.tag_name,
      name: data.name,
      publishedAt: data.published_at,
      downloadUrl: data.zipball_url
    };
  } catch (error) {
    console.error('Failed to fetch latest release:', error);
    return null;
  }
}

// =============================================================================
// Example 5: SEO and Meta Tags
// =============================================================================

/**
 * Generate SEO meta tags
 */
export function createSEOMetaTags() {
  const { repository, pages } = getGitHubUrls();
  const { description, topics } = getProjectMetadata();
  const { organization, project } = getRepositoryInfo();
  
  return {
    title: `${project} - ${description}`,
    description,
    keywords: topics.join(', '),
    author: organization,
    canonical: pages,
    openGraph: {
      title: project,
      description,
      url: pages,
      siteName: project,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: project,
      description,
      creator: `@${organization}`
    },
    github: {
      repository
    }
  };
}

// =============================================================================
// Example 6: Build-time Validation
// =============================================================================

/**
 * Validate configuration during build process
 */
export function validateConfigurationAtBuildTime() {
  const config = getGitHubConfig();
  const validation = validateGitHubConfig(config);
  
  if (!validation.success) {
    console.error('❌ GitHub configuration validation failed!');
    console.error((validation as { success: false; error: string }).error);
    process.exit(1);
  }
  
  console.log('✅ GitHub configuration is valid');
  return validation.data;
}

// =============================================================================
// Example 7: Dynamic URL Generation
// =============================================================================

/**
 * Generate URLs for different file paths in the repository
 */
export function createFileUrls() {
  const getFileUrl = (path: string, branch = 'main') => 
    getRepositoryUrl(`/blob/${branch}/${path}`);
  
  const getRawUrl = (path: string, branch = 'main') => 
    `https://raw.githubusercontent.com/${getRepositoryInfo().repo}/${branch}/${path}`;
  
  return {
    // Common file URLs
    readme: getFileUrl('README.md'),
    license: getFileUrl('LICENSE'),
    changelog: getFileUrl('CHANGELOG.md'),
    contributing: getFileUrl('CONTRIBUTING.md'),
    
    // Raw file URLs (for direct access)
    rawReadme: getRawUrl('README.md'),
    rawLicense: getRawUrl('LICENSE'),
    
    // Directory URLs
    docs: getRepositoryUrl('/tree/main/docs'),
    src: getRepositoryUrl('/tree/main/src'),
    examples: getRepositoryUrl('/tree/main/examples')
  };
}

// =============================================================================
// Example 8: Webhook and Integration URLs
// =============================================================================

/**
 * Generate URLs for various GitHub integrations
 */
export function createIntegrationUrls() {
  const { repo } = getRepositoryInfo();
  const { repository } = getGitHubUrls();
  
  return {
    // GitHub Pages deployment
    pagesDeployment: `${repository}/deployments`,
    
    // Webhook endpoints
    webhook: `${repository}/settings/hooks`,
    
    // Security
    security: `${repository}/security`,
    advisories: `${repository}/security/advisories`,
    
    // Insights
    insights: `${repository}/pulse`,
    traffic: `${repository}/graphs/traffic`,
    commits: `${repository}/graphs/commit-activity`,
    
    // Project management
    projects: `${repository}/projects`,
    milestones: `${repository}/milestones`,
    
    // CI/CD integration URLs
    ciStatus: `https://img.shields.io/github/actions/workflow/status/${repo}/ci.yml`,
    ciWorkflow: `${repository}/actions/workflows/ci.yml`
  };
}

// =============================================================================
// Example 9: Multi-environment Configuration
// =============================================================================

/**
 * Create configuration for different environments
 */
export function createEnvironmentConfigs() {
  const baseConfig = getGitHubConfig();
  
  return {
    development: {
      ...baseConfig,
      urls: {
        ...baseConfig.urls,
        pages: 'http://localhost:3000'
      }
    },
    
    staging: {
      ...baseConfig,
      urls: {
        ...baseConfig.urls,
        pages: 'https://staging.portfolio.subzerodev.com'
      }
    },
    
    production: baseConfig
  };
}

// =============================================================================
// Example 10: Component Props Generation
// =============================================================================

/**
 * Generate props for React components
 */
export function createComponentProps() {
  const config = getGitHubConfig();
  
  return {
    GitHubButton: {
      href: config.urls.repository,
      'aria-label': `View ${config.project} on GitHub`,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    
    StarButton: {
      href: config.urls.repository,
      count: '⭐', // This would be fetched from API
      'aria-label': `Star ${config.repo} on GitHub`
    },
    
    IssueReportButton: {
      href: config.urls.issues,
      'aria-label': 'Report an issue',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    
    ContributorsList: {
      apiUrl: config.urls.api + '/contributors',
      repoUrl: config.urls.repository
    }
  };
}

// Export all examples for easy importing
export const examples = {
  createProjectBadges,
  createNavigationLinks,
  createGiscusConfig,
  fetchRepositoryData,
  fetchLatestRelease,
  createSEOMetaTags,
  validateConfigurationAtBuildTime,
  createFileUrls,
  createIntegrationUrls,
  createEnvironmentConfigs,
  createComponentProps
};
