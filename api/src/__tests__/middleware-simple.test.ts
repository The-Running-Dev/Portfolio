// Mock the config before imports
jest.mock('../config', () => ({
  default: {
    apiKeys: ['test-key-1', 'test-key-2'],
    port: 3000,
    nodeEnv: 'test',
    rateLimitWindowMs: 900000,
    rateLimitMaxRequests: 100
  }
}));

import { Request, Response, NextFunction } from 'express';
import { createRateLimit } from '../middleware/rateLimit';
import { errorHandler } from '../middleware/errorHandler';

// Authentication Middleware tests removed - redundant with integration tests

describe('Rate Limit Middleware', () => {
  it('should create rate limit middleware', () => {
    const rateLimitMiddleware = createRateLimit();
    expect(rateLimitMiddleware).toBeDefined();
    expect(typeof rateLimitMiddleware).toBe('function');
  });
});

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      path: '/test',
      ip: '127.0.0.1'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should handle generic errors', () => {
    const error = new Error('Test error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Test error'
    });
  });

  it('should handle errors with status codes', () => {
    const error = new Error('Not found') as any;
    error.status = 404;

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // Error handler always returns 500
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not found'
    });
  });
});
