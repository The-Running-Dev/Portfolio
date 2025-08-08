import React from 'react';
import Layout from '@theme/Layout';
import PortfolioPage from '../components/PortfolioPage';

export default function Portfolio(): React.ReactElement {
  return (
    <Layout
      title="Portfolio"
      description="Technical portfolio showcasing full-stack development, DevOps, and automation projects">
      <PortfolioPage />
    </Layout>
  );
}
