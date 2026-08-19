import React, { type ReactNode } from 'react';

type Props = {
  header: ReactNode;
  primaryMenu: ReactNode;
};

/** The Explore drawer always opens the Portfolio's primary local navigation. */
export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu
}: Props): ReactNode {
  return (
    <div className="navbar-sidebar">
      {header}
      <div className="navbar-sidebar__items">
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
      </div>
    </div>
  );
}
