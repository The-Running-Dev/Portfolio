/**
 * Simplified Convention-Based Data Loading System
 * 
 * Convention:
 * - JSON files are automatically imported and made available
 * - Most data uses direct import without processing  
 * - Special cases handled via PROCESSORS config
 */

// Static imports for all JSON data files
import badgeConfigRaw from '../../config/badgeConfig.json';
import cvDataRaw from '../../config/cvData.json';
import featuresConfigRaw from '../../config/featuresConfig.json';
import giscusConfigRaw from '../../config/giscusConfig.json';
import gitHubLinksConfigRaw from '../../config/gitHubLinksConfig.json';
import navbarLinksRaw from '../../config/navbarLinks.json';
import portfolioDataRaw from '../../config/portfolioData.json';
import themesRaw from '../../config/themes.json';
import versionConfigRaw from '../../config/versionConfig.json';

// Type imports
import type { CVData } from '../components/CVPage';
import type { PortfolioData } from '../components/PortfolioPage';
import type { FeaturesConfig, NavbarLink, Theme } from '../entities';

// Define interfaces for JSON data structures
export interface BadgeConfigData {
    templateVariables: {
        demoUrl: string;
        docsUrl: string;
        user: string;
        repository: string;
    };
    badgeCategories: Array<{
        key: string;
        title: string;
        icon: string;
        badges: Array<{
            name: string;
            url: string;
            link: string;
        }>;
    }>;
}

export interface GiscusConfigData {
    enabled: boolean;
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: string;
    strict: string;
    reactionsEnabled: string;
    emitMetadata: string;
    inputPosition: string;
    theme: string;
    lang: string;
    loading: string;
}

export interface GitHubLinksConfigData {
    dropdown: boolean;
    className: string;
    dropdownLabel: string;
    showIcons: string;
    links: Array<{
        href: string;
        label: string;
        position: string;
        ariaLabel: string;
    }>;
}

export interface VersionConfigData {
    version: string;
    href: string;
    prefix: string;
    badge: boolean;
    className: string;
    title: string;
}

/**
 * Raw data mapping - all imported JSON files
 */
const RAW_DATA = {
    badgesConfig: badgeConfigRaw,
    cv: cvDataRaw,
    featuresConfig: featuresConfigRaw,
    giscusConfig: giscusConfigRaw,
    gitHubLinksConfig: gitHubLinksConfigRaw,
    navbarLinks: navbarLinksRaw,
    portfolio: portfolioDataRaw,
    themes: themesRaw,
    versionConfig: versionConfigRaw,
} as const;

/**
 * Data processors for special cases that need transformation
 */
const PROCESSORS = {
    themes: (data: any): { themes: Theme[]; defaultTheme: Theme } => {
        const themes: Theme[] = data.themes;
        const defaultTheme: Theme =
            themes.find((t) => t.name === data.defaultTheme) ||
            (themes.length > 0 ? themes[0] : {
                name: 'fallback',
                displayName: 'Default',
                cssFile: 'themes/default.css'
            });

        return { themes, defaultTheme };
    },
    navbarLinks: (data: any): NavbarLink[] => data.links || [],
} as const;

/**
 * Type-safe data getter
 */
export function getData<K extends keyof typeof RAW_DATA>(key: K) {
    const rawData = RAW_DATA[key];

    if (!rawData) {
        throw new Error(`Data not Found: ${key}`);
    }

    // Apply processor if exists, otherwise return raw data
    const processor = (PROCESSORS as any)[key];

    return processor ? processor(rawData) : rawData;
}

/**
 * Export typed data accessors for convenience
 */
export const badgesConfig = getData('badgesConfig') as BadgeConfigData;
export const cvData = getData('cv') as CVData;
export const featuresConfig = getData('featuresConfig') as FeaturesConfig;
export const giscusConfig = getData('giscusConfig') as GiscusConfigData;
export const gitHubLinksConfig = getData('gitHubLinksConfig') as GitHubLinksConfigData;
export const navbarLinks = getData('navbarLinks') as NavbarLink[];
export const portfolioData = getData('portfolio') as PortfolioData;
export const versionConfig = getData('versionConfig') as VersionConfigData;

// Themes with destructuring for backward compatibility
const themesData = getData('themes') as { themes: Theme[]; defaultTheme: Theme };
export const themes = themesData.themes;
export const defaultTheme = themesData.defaultTheme;

// Legacy aliases for backward compatibility
export const userCVData = cvData;
