import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createAppContainer, Container } from './container';
import { createResourceRouter } from './routes/resourceRoutes';
import { createHealthRouter } from './routes/healthRoutes';
import { createRateLimit } from './middleware/rateLimit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';
import { FileUtils } from './utils/helpers';
import { ResourceController } from './controllers/ResourceController';
import config from './config';
import logger from './utils/logger';

export class App {
  private app: Express;
  private container!: Container;

  constructor() {
    this.app = express();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize container
      this.container = await createAppContainer();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      await this.setupRoutes();

      // Setup API documentation
      await this.setupDocumentation();

      // Setup error handling
      this.setupErrorHandling();

      logger.info('Application Initialized Successfully');
    } catch (error) {
      logger.error('Failed to Initialize Application:', error);

      process.exit(1);
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: config.corsOrigin,
      credentials: config.corsCredentials
    }));

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan(config.logFormat));

    // Rate limiting
    this.app.use(createRateLimit());
  }

  private async setupRoutes(): Promise<void> {
    const baseUrl = `${config.apiBaseUrl}/${config.apiVersion}`;

    // Health check route
    this.app.use(`${baseUrl}/health`, createHealthRouter());

    // Dynamic resource routes
    await this.setupResourceRoutes(baseUrl);

    // Root endpoint
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Portfolio API Server',
        version: '1.0.0',
        documentation: '/api-docs',
        health: `${baseUrl}/health`
      });
    });
  }

  private async setupResourceRoutes(baseUrl: string): Promise<void> {
    try {
      const dataFiles = await FileUtils.getFilesInDirectory(config.dataDirectory);

      for (const file of dataFiles) {
        const resourceName = FileUtils.getResourceNameFromFilename(file);
        const controllerName = `${resourceName}Controller`;

        if (this.container.resolve(controllerName)) {
          const controller = this.container.resolve(controllerName) as ResourceController;
          const resourceRouter = createResourceRouter(controller);
          
          this.app.use(`${baseUrl}/${resourceName}`, resourceRouter);

          logger.info(`Registered Routes for Resource: ${resourceName}`);
        }
      }
    } catch (error) {
      logger.error('Error Setting up Resource Routes:', error);

      throw error;
    }
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  private async setupDocumentation(): Promise<void> {
    await setupSwagger(this.app);
  }

  public getApp(): Express {
    return this.app;
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      const server = this.app.listen(config.port, () => {
        logger.info(`Server is Running, Port: ${config.port}`);
        logger.info(`API Documentation: http://localhost:${config.port}/api-docs`);
        logger.info(`Health Check: http://localhost:${config.port}${config.apiBaseUrl}/${config.apiVersion}/health`);
        resolve();
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        logger.info('SIGTERM Received, Shutting Down Gracefully');
        
        server.close(() => {
          logger.info('Server Closed');

          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        logger.info('SIGINT Received, Shutting Down Gracefully');

        server.close(() => {
          logger.info('Server Closed');
          
          process.exit(0);
        });
      });
    });
  }
}
