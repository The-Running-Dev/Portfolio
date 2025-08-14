import React from 'react';
import Layout from '@theme/Layout';

/**
 * Theme Test Page
 * Simple page to test the configurable theme switcher
 */
export default function ThemesPage(): React.JSX.Element {
  return (
    <Layout
      title="Theme Test"
      description="Test the configurable theme switcher"
    >
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>🎨 Configurable Theme Switcher Test</h1>

            <div className="alert alert--info margin-bottom--lg">
              <h4>🧪 Testing the Configuration System Integration</h4>
              <p>
                This page tests the enhanced ThemeSwitcher that now uses the
                configuration management system.
              </p>
              <ul>
                <li>✅ Theme selection persists in configuration storage</li>
                <li>✅ Feature flag controls theme switcher visibility</li>
                <li>✅ Configuration changes sync in real-time</li>
                <li>✅ Backward compatible with existing localStorage</li>
              </ul>
            </div>

            <div className="alert alert--success">
              <h4>🎯 How to Test:</h4>
              <ol>
                <li>Use the theme switcher in the navbar (if enabled)</li>
                <li>
                  Check the configuration panel (gear icon ⚙️) - Feature Flags
                  tab
                </li>
                <li>Toggle the "theme-switcher" feature flag on/off</li>
                <li>
                  Notice the theme switcher appears/disappears immediately
                </li>
                <li>Change themes and reload the page - selection persists</li>
              </ol>
            </div>

            <div className="alert alert--warning">
              <h4>📊 Configuration Details:</h4>
              <ul>
                <li>
                  <code>ui.current-theme</code> - Currently selected theme name
                </li>
                <li>
                  <code>ui.available-themes</code> - Array of available theme
                  configs
                </li>
                <li>
                  <code>feature.theme-switcher</code> - Feature flag for theme
                  switcher visibility
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '2rem',
                background: 'var(--ifm-color-emphasis-100)',
                borderRadius: '8px',
                marginTop: '2rem'
              }}
            >
              <h3>Color Test Area</h3>
              <p>This area should change colors when you switch themes:</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem'
                }}
              >
                <div
                  style={{
                    padding: '1rem',
                    background: 'var(--ifm-color-primary)',
                    color: 'white',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  Primary Color
                </div>
                <div
                  style={{
                    padding: '1rem',
                    background: 'var(--ifm-color-secondary)',
                    color: 'white',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  Secondary Color
                </div>
                <div
                  style={{
                    padding: '1rem',
                    background: 'var(--ifm-color-success)',
                    color: 'white',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  Success Color
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
