import { HttpDataProvider } from '../../context';
import Projects from './Projects';

/**
 * Http Projects component configuration
 */
export interface HttpProjectsProps {
  /** Endpoint URL */
  endpoint?: string;
   
  /** Additional request options */
  options?: RequestInit;
  
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  
  /** Retry attempts */
  retryAttempts?: number;
  
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * Projects component using HTTP data
 * This implementation fetches data from a REST API
 */
export function HttpProjects({
  endpoint = 'http://localhost:3001/api/v1/projects',
  options,
  autoFetch = true,
}: HttpProjectsProps = {}) {
  return (
    <HttpDataProvider
      endpoint={endpoint}
      options={options}
      autoFetch={autoFetch}
    >
      <Projects />
    </HttpDataProvider>
  );
}

export default HttpProjects;
