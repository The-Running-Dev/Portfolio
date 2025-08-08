/**
 * Centralized data exports
 * All data access should go through this file for consistency
 */

// Re-export everything from the data loader
export * from './dataLoader';

// Re-export types for convenience  
export type { CVData } from '../components/CVPage/models';
export type { PortfolioData } from '../components/PortfolioPage/models';
export type { Theme } from '../entities/theme';
export type { NavbarLink } from '../entities/navbarLink';
export type { FeaturesConfig } from '../entities/featuresConfig';
export type {
    BadgeConfigData,
    GiscusConfigData,
    GitHubLinksConfigData,
    VersionConfigData
} from './dataLoader';