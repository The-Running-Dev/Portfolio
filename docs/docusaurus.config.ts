import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import { SiteConfig, SiteThemeConfig } from './config/site-config';
import type { NavbarLink } from './src/entities';
import navbarData from './data/navbarLinks.json';

const navbarLinks: NavbarLink[] = (navbarData?.links || []) as NavbarLink[];

const config: Config = {
  // Use base defaults
  ...SiteConfig,
  // Add additional configuration
  trailingSlash: false,
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    mermaid: true
  },
  themes: ['@docusaurus/theme-mermaid'],
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts'
        },
        theme: {
          //customCss: './static/themes/default.css'
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],
  themeConfig: {
    // Merge base theme config
    ...SiteThemeConfig,
    // Add additional theme configuration
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      ...SiteThemeConfig.navbar,
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Projects',
        },
         {
          type: 'custom-CVPage',
          position: 'left'
        },
        {
          type: 'custom-PortfolioPage',
          position: 'left'
        },
        {
          type: 'custom-gitHubLinks',
          position: 'right'
        },
        {
          type: 'custom-versionDisplay',
          position: 'right'
        },
        {
          type: 'custom-themeSwitcher',
          position: 'right'
        },
        {
          type: 'custom-textSizeSwitcher',
          position: 'right'
        },
        {
          type: 'custom-readerMode',
          position: 'right'
        },
        // ...auto generated links,
        ...navbarLinks
      ]
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
