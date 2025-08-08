import React from 'react';
import Link from '@docusaurus/Link';
import { featuresConfig } from '../../data';

const CVPageLinkNavbarItem: React.FC = () => {
  // Don't render if CV page is disabled
  if (!featuresConfig.enableCVPage) {
    return null;
  }

  return (
    <Link 
      to="/cv"
      className="navbar__item navbar__link"
      activeClassName="navbar__link--active"
    >
      CV/Resume
    </Link>
  );
};

export default CVPageLinkNavbarItem;