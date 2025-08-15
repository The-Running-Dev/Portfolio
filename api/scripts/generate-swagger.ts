import fs from 'fs/promises';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

async function getAvailableResources(): Promise<string[]> {
  try {
    const dataPath = path.join(__dirname, '..', 'data');
    const files = await fs.readdir(dataPath);
    return files
      .filter(file => file.endsWith('.json') && file !== 'index.ts')
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.warn('Could not read data directory, using default resources');
    return ['projects', 'skills', 'users']; // fallback
  }
}

async function generateSwaggerJson(): Promise<void> {
  try {
    const resources = await getAvailableResources();
    
    const swaggerOptions = {
      definition: {
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
            url: `http://localhost:3001/api/v1`,
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
        ]
      },
      apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts'
      ]
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    const outputPath = path.join(__dirname, '..', 'swagger.json');
    await fs.writeFile(outputPath, JSON.stringify(swaggerSpec, null, 2));
    
    console.log('Swagger JSON generated successfully at:', outputPath);
    console.log('Available API resources:', resources.join(', '));
    console.log('Total resources:', resources.length);
  } catch (error) {
    console.error('Error generating Swagger JSON:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  generateSwaggerJson();
}
