import React from 'react';

//import { ConfigurationProvider } from '../components/ConfigurationManager';

// This is a Docusaurus root wrapper that provides global configuration context
export default function Root({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      {/* <ConfigurationProvider> */}
      {children}
      {/* </ConfigurationProvider> */}
    </>
  );
}
