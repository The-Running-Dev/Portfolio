import rateLimit from 'express-rate-limit';
import config from '../config';
import logger from '../utils/logger';

export const createRateLimit = () => {
  return rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: {
      success: false,
      error: 'Too Many Requests from This IP, Please Try Again Later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use API key for rate limiting if available, otherwise fall back to IP
      return (req as any).apiKey || req.ip;
    },
    handler: (req, res) => {
      logger.warn('Rate Limit Exceeded', {
        ip: req.ip,
        apiKey: (req as any).apiKey,
        path: req.path,
        method: req.method
      });
      
      res.status(429).json({
        success: false,
        error: 'Too Many Requests from This IP, Please Try Again Later.'
      });
    }
  });
};
