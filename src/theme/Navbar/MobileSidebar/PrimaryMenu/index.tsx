import React, { type ReactNode } from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem';

function useLocalNavbarItems(): NavbarItemConfig[] {
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  return items.filter((item) => item.position !== 'right');
}

/** Keep ecosystem links in the visible masthead and local routes in Explore. */
export default function NavbarMobilePrimaryMenu(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useLocalNavbarItems();

  return (
    <ul className="menu__list">
      {items.map((item, index) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={index}
        />
      ))}
    </ul>
  );
}
