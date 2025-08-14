import React from 'react';
import { useApi } from '../../hooks/useApi';

/**
 * Example component showing how to use the useApi hook for project data
 * This component demonstrates the API hook that is disabled by default
 */
export const ApiProjectsExample: React.FC = () => {
  // Using the general useApi hook (disabled by default)
  const { data, loading, error, enabled, refetch } = useApi({
    endpoint: '/api/projects'
    // enabled: true, // Uncomment this line to enable API fetching
  });

  if (!enabled) {
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          margin: '1rem 0'
        }}
      >
        <h3>API Data Fetching</h3>
        <p>
          <strong>Status:</strong> Disabled (by default)
        </p>
        <p>
          The API hook is disabled by default for security and performance
          reasons. To enable it, you need to:
        </p>
        <ol>
          <li>
            Set the feature flag <code>apiDataFetching: true</code> in
            GlobalConfig.json
          </li>
          <li>
            Pass <code>enabled: true</code> to the useApi hook
          </li>
        </ol>
        <p>
          <em>This demonstrates the disabled state behavior.</em>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '1rem 0'
      }}
    >
      <h3>API Projects Data</h3>

      {loading && (
        <div style={{ color: '#0066cc' }}>
          <p>🔄 Loading Projects from API...</p>
        </div>
      )}

      {error && (
        <div style={{ color: '#cc0000', marginBottom: '1rem' }}>
          <p>❌ Error: {error.message}</p>
          <button
            onClick={refetch}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#cc0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {data && !loading && (
        <div>
          <p style={{ color: '#008800' }}>
            ✅ Successfully loaded{' '}
            {Array.isArray(data) ? data.length : 'project'} project(s)
          </p>
          <details>
            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
              📊 View Raw Data
            </summary>
            <pre
              style={{
                backgroundColor: '#f8f8f8',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.9rem'
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p>
          <strong>Hook Configuration:</strong>
        </p>
        <ul>
          <li>Enabled: {enabled ? '✅ Yes' : '❌ No'}</li>
          <li>
            Endpoint: <code>/api/projects</code>
          </li>
          <li>Auto-fetch: ✅ Yes</li>
          <li>Retry attempts: 3</li>
          <li>Retry delay: 1500ms</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiProjectsExample;
