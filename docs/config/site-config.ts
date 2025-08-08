import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as path from 'path';

/**
 * Pre-build Configuration
 * Applies to the build process, see scripts/pre-build.ts
 */
export const PreBuildConfig = {
  ProjectRoot: path.join(__dirname, '../'),
  OverwriteExistingFiles: true,
  DefaultTheme: 'blue'
};

/**
 * Site Configuration
 * See https://docusaurus.io/docs/configuration
 */
export const SiteConfig = {
  title: 'Portfolio',
  tagline: 'Technical Projects & Experience',
  url: 'https://portfolio.subzerodev.com',
  baseUrl: '/',
  organizationName: 'The-Running-Dev',
  projectName: 'Portfolio'
} as const;

/**
 * Theme Configuration
 * See https://docusaurus.io/docs/configuration
 */
export const SiteThemeConfig = {
  navbar: {
    title: 'Portfolio',
    logo: {
      alt: 'Portfolio',
      src: 'img/logo.svg'
    }
  }
} as const;

// For backward compatibility
export const config: Config = {
  ...SiteConfig,
  themeConfig: SiteThemeConfig satisfies Preset.ThemeConfig
};

export default config;