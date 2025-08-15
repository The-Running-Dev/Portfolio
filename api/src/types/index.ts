import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  offset?: string;
}

export interface FilterQuery {
  [key: string]: any;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryParams extends PaginationQuery, FilterQuery, SortQuery {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ResourceConfig {
  name: string;
  path: string;
  schema?: any;
  readonly?: boolean;
  allowedMethods?: string[];
}

export interface DataRepository {
  findAll(query?: QueryParams): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: FilterQuery): Promise<number>;
}

export interface Logger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiVersion: string;
  apiBaseUrl: string;
  apiKeys: string[];
  authRequired: boolean;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  logFormat: string;
  corsOrigin: string;
  corsCredentials: boolean;
  dataDirectory: string;
}
