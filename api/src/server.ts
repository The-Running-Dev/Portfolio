import { App } from './app';
import logger from './utils/logger';

async function bootstrap(): Promise<void> {
  try {
    const app = new App();

    await app.initialize();
    await app.start();
  } catch (error) {
    logger.error('Failed to Start Server:', error);

    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  
  process.exit(1);
});

// Start the server
bootstrap();
