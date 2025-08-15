import dotenv from 'dotenv';
import { AppConfig } from '../types';

// Load environment-specific config
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  apiBaseUrl: process.env.API_BASE_URL || '/api',
  apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
  authRequired: process.env.AUTH_REQUIRED === 'true',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'combined',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  dataDirectory: process.env.DATA_DIRECTORY || './data'
};

export default config;
