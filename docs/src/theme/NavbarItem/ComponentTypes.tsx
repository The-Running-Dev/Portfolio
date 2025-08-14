import ComponentTypesObject from '@theme/NavbarItem/ComponentTypes';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

import CVNavbarItem from './CVPageLinkNavbarItem';
import GitHubLinksNavbarItem from './GitHubLinksNavbarItem';
import NavBarLinksNavbarItem from './NavBarLinksNavbarItem';
import PortfolioNavbarItem from './PortfolioPageLinkNavbarItem';
import ProjectsNavbarItem from './ProjectsPageLinkNavbarItem';
import ReaderModeNavbarItem from './ReaderModeNavbarItem';
import TextSizeSwitcherNavbarItem from './TextSizeSwitcherNavbarItem';
import ThemeSwitcherNavbarItem from './ThemeSwitcherNavbarItem';
import VersionDisplayNavbarItem from './VersionDisplayNavbarItem';

// If '@theme/NavbarItem/ComponentTypes' exports a value, use typeof for the type annotation
const ComponentTypes: typeof ComponentTypesObject = {
  default: DefaultNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  dropdown: DropdownNavbarItem,
  html: HtmlNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
  'custom-CVPage': CVNavbarItem,
  'custom-NavBarLinks': NavBarLinksNavbarItem,
  'custom-PortfolioPage': PortfolioNavbarItem,
  'custom-ProjectsPage': ProjectsNavbarItem,
  'custom-ThemeSwitcher': ThemeSwitcherNavbarItem,
  'custom-TextSizeSwitcher': TextSizeSwitcherNavbarItem,
  'custom-ReaderMode': ReaderModeNavbarItem,
  'custom-VersionDisplay': VersionDisplayNavbarItem,
  'custom-GitHubLinks': GitHubLinksNavbarItem
};

export default ComponentTypes;
