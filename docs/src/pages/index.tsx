import type { ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import PortfolioPage from '../components/PortfolioPage';
import { featuresConfig } from '../data';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          Welcome to my technical portfolio
        </p>
        <div style={{ marginTop: '2rem' }}>
          {featuresConfig.enablePortfolioPage && (
            <a
              className="button button--secondary button--lg"
              href="/portfolio">
              View Portfolio
            </a>
          )}
          {featuresConfig.enableCVPage && (
            <a
              className="button button--secondary button--lg"
              href="/cv"
              style={{ marginLeft: featuresConfig.enablePortfolioPage ? '1rem' : '0' }}>
              View CV/Resume
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  // If UsePortfolioPageAsIndex is enabled AND portfolio page is enabled, show the Portfolio page directly
  if (featuresConfig.usePortfolioPageAsIndex && featuresConfig.enablePortfolioPage) {
    return (
      <Layout
        title="Portfolio"
        description="Technical portfolio showcasing full-stack development, DevOps, and automation projects">
        <PortfolioPage />
      </Layout>
    );
  }

  // Otherwise show the simple welcome page
  return (
    <Layout
      title="Welcome"
      description="Welcome to Ben's technical portfolio and professional profile">
      <HomepageHeader />
    </Layout>
  );
}
