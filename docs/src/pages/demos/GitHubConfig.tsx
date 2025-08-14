import type { JSX } from 'react';
import Layout from '@theme/Layout';

import GitHubInfo from '../../components/GitHubInfo';

export default function GitHubConfigPage(): JSX.Element {
  return (
    <Layout
      title="GitHub Configuration Demo"
      description="Demonstration of dynamic GitHub configuration loading from YAML"
    >
      <div className="container margin-top--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <header>
              <h1>🔧 GitHub Configuration Demo</h1>
              <p>
                This page demonstrates the new dynamic GitHub configuration
                system that loads settings from YAML/JSON files using the
                enhanced loader system.
              </p>
            </header>

            <main>
              <section className="margin-bottom--xl">
                <h2>📋 Basic YAML Configuration</h2>
                <p>This shows the simpler YAML-only approach:</p>
                <GitHubInfo />
              </section>
            </main>

            <section className="margin-top--lg">
              <h2>💡 About This Demo</h2>
              <p>
                This component uses the new dynamic configuration loader to:
              </p>
              <ul>
                <li>
                  ✅ Load GitHub configuration from{' '}
                  <code>config/github.yaml</code>
                </li>
                <li>✅ Parse YAML content using js-yaml</li>
                <li>✅ Provide type-safe access to configuration data</li>
                <li>✅ Support immutable configuration objects</li>
                <li>✅ Include validation and error handling</li>
                <li>✅ Support both JSON and YAML formats</li>
              </ul>
            </section>

            <section className="margin-top--lg">
              <h2>🛠 Implementation Approaches</h2>
              <div className="row">
                <div className="col col--4">
                  <h4>🏭 Production System</h4>
                  <ul>
                    <li>Zod schema validation</li>
                    <li>Immutable configuration objects</li>
                    <li>Metadata and error tracking</li>
                    <li>Auto-source detection</li>
                    <li>Production-ready hooks</li>
                  </ul>
                </div>
                <div className="col col--4">
                  <h4>🎯 Interactive Demo</h4>
                  <ul>
                    <li>Dynamic source switching</li>
                    <li>YAML & JSON comparison</li>
                    <li>Visual source indicators</li>
                    <li>Runtime parsing demos</li>
                    <li>User-friendly interface</li>
                  </ul>
                </div>
                <div className="col col--4">
                  <h4>📋 Basic Example</h4>
                  <ul>
                    <li>Simple YAML parsing</li>
                    <li>js-yaml integration</li>
                    <li>TypeScript type safety</li>
                    <li>Basic error handling</li>
                    <li>Minimal implementation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="margin-top--lg">
              <h2>🚀 Key Features Demonstrated</h2>
              <div className="row">
                <div className="col col--6">
                  <h4>Configuration Loading</h4>
                  <ul>
                    <li>✅ YAML parsing with js-yaml</li>
                    <li>✅ JSON static imports</li>
                    <li>✅ Convention-based file discovery</li>
                    <li>✅ Multiple source format support</li>
                    <li>✅ Runtime validation with Zod schemas</li>
                    <li>✅ TypeScript type safety</li>
                  </ul>
                </div>
                <div className="col col--6">
                  <h4>Production Features</h4>
                  <ul>
                    <li>✅ Immutable configuration objects</li>
                    <li>✅ Comprehensive error handling</li>
                    <li>✅ Loading metadata and diagnostics</li>
                    <li>✅ Integration with existing data loader</li>
                    <li>✅ Extensible architecture</li>
                    <li>✅ Performance optimization with useMemo</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
