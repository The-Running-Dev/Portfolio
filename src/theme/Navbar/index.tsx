import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import NavbarContent from '@theme/Navbar/Content';
import NavbarLayout from '@theme/Navbar/Layout';

/**
 * Docusaurus translation of the shared SubZeroDev masthead.
 */
export default function Navbar(): ReactNode {
  return (
    <header className="site-masthead">
      <div className="site-masthead__frame">
        <div className="site-masthead__stack">
          <div className="site-masthead__identity">
            <Link
              className="site-masthead__brand"
              href="https://subzerodev.com/"
            >
              SubZeroDev
            </Link>
            <p className="site-masthead__meta">
              Professional uncertainty since 2026.
            </p>
            <p className="site-masthead__slogan">Well… Why not?</p>
          </div>
          <NavbarLayout>
            <NavbarContent />
          </NavbarLayout>
          <hr className="site-masthead__rule" />
        </div>
      </div>
    </header>
  );
}
