import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from '../config';
import { FileUtils } from '../utils/helpers';

async function createDynamicSwaggerSpec() {
  // Get available data files to generate dynamic endpoints
  const dataFiles = await FileUtils.getFilesInDirectory(config.dataDirectory);
  const resources = dataFiles.map(file => FileUtils.getResourceNameFromFilename(file));

  // Create dynamic paths for each resource
  const paths: any = {};
  
  resources.forEach(resource => {
    paths[`/${resource}`] = {
      get: {
        tags: [resource],
        summary: `Get all ${resource}`,
        description: `Retrieve all items from the ${resource} resource`,
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number'
          },
          {
            name: 'limit',
            in: 'query', 
            schema: { type: 'integer', default: 10 },
            description: 'Number of items per page'
          }
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { type: 'object' } },
                    pagination: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: [resource],
        summary: `Create new ${resource} item`,
        description: `Add a new item to the ${resource} resource`,
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        },
        responses: {
          201: { description: 'Created successfully' },
          400: { description: 'Bad request' }
        }
      }
    };

    paths[`/${resource}/stats`] = {
      get: {
        tags: [resource],
        summary: `Get ${resource} statistics`,
        description: `Get statistical information about the ${resource} resource`,
        responses: {
          200: {
            description: 'Statistics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        lastUpdated: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    paths[`/${resource}/{id}`] = {
      get: {
        tags: [resource],
        summary: `Get ${resource} by ID`,
        description: `Retrieve a specific item from the ${resource} resource`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: `The ${resource} item ID`
          }
        ],
        responses: {
          200: { description: 'Item found' },
          404: { description: 'Item not found' }
        }
      },
      put: {
        tags: [resource],
        summary: `Update ${resource} by ID`,
        description: `Update a specific item in the ${resource} resource`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: `The ${resource} item ID`
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        },
        responses: {
          200: { description: 'Updated successfully' },
          404: { description: 'Item not found' }
        }
      },
      delete: {
        tags: [resource],
        summary: `Delete ${resource} by ID`,
        description: `Remove a specific item from the ${resource} resource`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: `The ${resource} item ID`
          }
        ],
        responses: {
          200: { description: 'Deleted successfully' },
          404: { description: 'Item not found' }
        }
      }
    };
  });

  const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: `Modular Express.js API Server for Portfolio Project. Available resources: ${resources.join(', ')}`,
      contact: {
        name: 'Portfolio API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiBaseUrl}/${config.apiVersion}`,
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for Authentication'
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ],
    paths: {
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Health check endpoint',
          description: 'Returns the health status of the API',
          responses: {
            200: {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                      uptime: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      ...paths
    }
  };

  return swaggerSpec;
}

let swaggerSpec: any = null;

export async function getSwaggerSpec() {
  if (!swaggerSpec) {
    swaggerSpec = await createDynamicSwaggerSpec();
  }
  return swaggerSpec;
}

export async function setupSwagger(app: Express): Promise<void> {
  const spec = await getSwaggerSpec();
  
  // Serve swagger-ui assets
  app.use('/api-docs', swaggerUi.serve);
  
  // Setup swagger-ui page
  app.get('/api-docs', swaggerUi.setup(spec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Portfolio API Documentation'
  }));
}
