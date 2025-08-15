import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import config from '../config';
import logger from '../utils/logger';

export const authenticateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Check header (case insensitive) and query parameters (case insensitive)
  const apiKey = req.headers['x-api-key'] as string || 
                 req.query.apiKey as string || 
                 req.query.apikey as string;

  if (!apiKey) {
    logger.warn('API Key Missing', { ip: req.ip, path: req.path });

    res.status(401).json({
      success: false,
      error: 'API Key is Required. Provide it in the X-API-Key Header or apiKey/apikey Query Parameter.'
    });
    return;
  }

  if (!config.apiKeys.includes(apiKey)) {
    logger.warn('Invalid API Key Attempt', { apiKey, ip: req.ip, path: req.path });

    res.status(401).json({
      success: false,
      error: 'Invalid API Key.'
    });

    return;
  }

  req.apiKey = apiKey;
  
  logger.debug('API Key Authenticated', { apiKey: apiKey.substring(0, 4) + '****', path: req.path });
  
  next();
};

/**
 * Conditional authentication middleware that only enforces auth if AUTH_REQUIRED is true
 */
export const optionalAuthenticateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // If authentication is not required, skip validation
  if (!config.authRequired) {
    logger.debug('Authentication Skipped - AUTH_REQUIRED is false', { path: req.path });
    next();
    return;
  }

  // If no API keys are configured but auth is required, log warning and continue
  if (config.authRequired && config.apiKeys.length === 0) {
    logger.warn('Authentication Required but No API Keys Configured', { path: req.path });
    next();
    return;
  }

  // Use the standard authentication middleware
  authenticateApiKey(req, res, next);
};
