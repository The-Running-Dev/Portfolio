import React from 'react';
import Link from '@docusaurus/Link';
import { featuresConfig } from '../../data';

const PortfolioPageLinkNavbarItem: React.FC = () => {
  // Don't render if Portfolio page is disabled
  if (!featuresConfig.enablePortfolioPage) {
    return null;
  }

  // Don't render if Portfolio is being used as the index page
  if (featuresConfig.usePortfolioPageAsIndex) {
    return null;
  }

  return (
    <Link 
      to="/portfolio"
      className="navbar__item navbar__link"
      activeClassName="navbar__link--active"
    >
      Portfolio
    </Link>
  );
};

export default PortfolioPageLinkNavbarItem;
