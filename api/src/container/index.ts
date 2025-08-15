import { createContainer, asValue, InjectionMode } from 'awilix';
import path from 'path';
import { ResourceConfig } from '../types';
import { JsonFileRepository } from '../repositories/JsonFileRepository';
import { ResourceService } from '../services/ResourceService';
import { ResourceController } from '../controllers/ResourceController';
import { FileUtils } from '../utils/helpers';
import config from '../config';
import logger from '../utils/logger';

export interface Container {
  resolve<T>(name: string): T;
  register(registrations: any): void;
}

export async function createAppContainer(): Promise<Container> {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  // Register configuration
  container.register({
    config: asValue(config),
    logger: asValue(logger)
  });

  // Register utilities
  container.register({
    fileUtils: asValue(FileUtils)
  });

  // Auto-discover and register resources
  await registerResources(container);

  return container;
}

async function registerResources(container: any): Promise<void> {
  try {
    const dataFiles = await FileUtils.getFilesInDirectory(config.dataDirectory);
    
    logger.info(`Found ${dataFiles.length} data files in ${config.dataDirectory}`);

    for (const file of dataFiles) {
      const resourceName = FileUtils.getResourceNameFromFilename(file);
      const resourceConfig: ResourceConfig = {
        name: resourceName,
        path: path.join(config.dataDirectory, file),
        readonly: false // Can be configured per resource
      };

      // Create and register repository instance
      const repository = new JsonFileRepository(resourceName);
      container.register({
        [`${resourceName}Repository`]: asValue(repository)
      });

      // Create and register service instance
      const service = new ResourceService(repository, resourceConfig);
      container.register({
        [`${resourceName}Service`]: asValue(service)
      });

      // Create and register controller instance
      const controller = new ResourceController(service);
      container.register({
        [`${resourceName}Controller`]: asValue(controller)
      });

      logger.debug(`Registered Resource: ${resourceName}`);
    }
  } catch (error) {
    logger.error('Error Registering Resources:', error);
    throw error;
  }
}
