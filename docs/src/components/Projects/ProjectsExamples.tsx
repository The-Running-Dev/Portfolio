import { HttpDataProvider, JsonDataProvider } from '../../context';
import Projects from './Projects'; // Using the new base component

/**
 * Example usage of the new data provider architecture
 */

// Example 1: Projects with static JSON data (default behavior)
export function ProjectsWithStaticData() {
  return (
    <JsonDataProvider>
      <Projects />
    </JsonDataProvider>
  );
}

// Example 2: Projects with API data
export function ProjectsWithApiData() {
  return (
    <HttpDataProvider
      endpoint="http://localhost:3000/api/v1/projects"
      autoFetch={true}
    >
      <Projects />
    </HttpDataProvider>
  );
}

// Example 3: Projects with custom API configuration
export function ProjectsWithCustomApi() {
  return (
    <HttpDataProvider
      endpoint="https://api.example.com/projects"
      options={{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token-here'
        }
      }}
      autoFetch={true}
    >
      <Projects />
    </HttpDataProvider>
  );
}

// Example 4: Switch between data sources based on environment
export function ProjectsWithEnvironmentBasedData() {
  // Safely check for environment variables in browser
  const getEnvVar = (name: string, defaultValue: string) => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[name] || defaultValue;
    }
    return defaultValue;
  };

  const isProduction = getEnvVar('NODE_ENV', 'development') === 'production';
  const useApiFromEnv = getEnvVar('REACT_APP_USE_API', 'false') === 'true';
  const useApi = isProduction || useApiFromEnv;

  if (useApi) {
    return (
      <HttpDataProvider
        endpoint={getEnvVar('REACT_APP_API_ENDPOINT', "http://localhost:3000/api/v1/projects")}
      >
        <Projects />
      </HttpDataProvider>
    );
  }

  return (
    <JsonDataProvider>
      <Projects />
    </JsonDataProvider>
  );
}

export default ProjectsWithStaticData;
