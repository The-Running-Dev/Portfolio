import {themes as prismThemes} from 'prism-react-renderer';
import getVersion from './scripts/get-version';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const version = getVersion();
const config: Config = {
  title: 'Portfolio',
  tagline: 'Technical Projects & Experience',
  favicon: 'img/favicon.ico',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  future: {
    v4: true,
  },
  url: 'https://portfolio.subzerodev.com',
  baseUrl: '/',
  trailingSlash: false,
  organizationName: 'The-Running-Dev',
  projectName: 'Portfolio',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Portfolio',
      logo: {
        alt: 'Portfolio',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'projectsSidebar',
          position: 'left',
          label: 'Projects',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'experienceSidebar',
        //   position: 'left',
        //   label: 'Experience',
        // },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'aboutSidebar',
        //   position: 'left',
        //   label: 'About Me',
        // },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'contactSidebar',
        //   position: 'left',
        //   label: 'Contact',
        // },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          label: `v${version}`,
          position: 'right',
          href: '#',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
