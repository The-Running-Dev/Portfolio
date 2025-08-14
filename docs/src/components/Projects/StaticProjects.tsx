import { JsonDataProvider } from '../../context';
import Projects from './Projects';

/**
 * Projects component using static JSON data
 * This is the default implementation that uses static data files
 */
export function StaticProjects() {
  return (
    <JsonDataProvider>
      <Projects />
    </JsonDataProvider>
  );
}

export default StaticProjects;
