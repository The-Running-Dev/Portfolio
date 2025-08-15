import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled Error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  const response: ApiResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : error.message
  };

  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route Not Found', { path: req.path, method: req.method, ip: req.ip });

  const response: ApiResponse = {
    success: false,
    error: `Route ${req.method} ${req.path} Not Found`
  };

  res.status(404).json(response);
};

export const validationErrorHandler = (
  errors: string[],
  res: Response
): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Validation Failed',
    message: errors.join(', ')
  };

  res.status(400).json(response);
};
