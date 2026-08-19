import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import { getData } from './src/data';
import { GlobalConfig } from './src/entities';
import { globalConfig as configData } from './data/';

const globalConfig = getData<GlobalConfig>(configData);
const config: Config = {
  ...globalConfig.site,
  trailingSlash: false,
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'warn',
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
          customCss: './static/themes/default.css'
        }
      } satisfies Preset.Options
    ]
  ],
  themeConfig: {
    ...globalConfig.theme,
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      hideOnScroll: false,
      items: [
        {
          to: '/',
          position: 'left',
          label: 'Portfolio',
          exact: true
        },
        {
          type: 'custom-Projects',
          position: 'left'
        },
        {
          type: 'custom-CV',
          position: 'left'
        },
        {
          href: 'https://subzerodev.com/',
          position: 'right',
          label: 'SubZeroDev.com'
        },
        {
          href: 'https://blog.subzerodev.com/',
          position: 'right',
          label: 'Blog'
        },
        {
          href: 'https://github.com/The-Running-Dev?tab=repositories',
          position: 'right',
          label: 'Projects'
        },
        {
          href: 'https://portfolio.subzerodev.com/',
          position: 'right',
          label: 'Portfolio',
          className: 'site-masthead__ecosystem-active'
        }
      ]
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false
    },
    footer: {
      style: 'dark',
      links: [
        {
          href: 'https://subzerodev.com/',
          label: 'SubZeroDev.com'
        },
        {
          href: 'https://blog.subzerodev.com/',
          label: 'Blog'
        },
        {
          href: 'https://github.com/The-Running-Dev?tab=repositories',
          label: 'Projects'
        },
        {
          href: 'https://portfolio.subzerodev.com/',
          label: 'Portfolio',
          className: 'site-masthead__ecosystem-active'
        }
      ]
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
