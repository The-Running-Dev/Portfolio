import fs from 'fs/promises';
import path from 'path';
import { QueryParams, FilterQuery } from '../types';

export class FileUtils {
  static async readJsonFile<T = any>(filePath: string): Promise<T> {
    const content = await fs.readFile(filePath, 'utf-8');

    return JSON.parse(content);
  }

  static async writeJsonFile(filePath: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);

    await fs.writeFile(filePath, content, 'utf-8');
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);

      return true;
    } catch {
      return false;
    }
  }

  static async getFilesInDirectory(directory: string, extension = '.json'): Promise<string[]> {
    try {
      const files = await fs.readdir(directory);
      return files.filter(file => file.endsWith(extension));
    } catch {
      return [];
    }
  }

  static getResourceNameFromFilename(filename: string): string {
    return path.basename(filename, path.extname(filename));
  }
}

export class QueryUtils {
  static applyFiltering<T>(data: T[], filter: FilterQuery): T[] {
    if (!filter || Object.keys(filter).length === 0) {
      return data;
    }

    return data.filter((item: any) => {
      return Object.entries(filter).every(([key, value]) => {
        if (key === 'page' || key === 'limit' || key === 'offset' || key === 'sortBy' || key === 'sortOrder') {
          return true; // Skip pagination and sorting params
        }

        if (!Object.prototype.hasOwnProperty.call(item, key)) {
          return false;
        }

        const itemValue = item[key];
        
        if (typeof value === 'string' && value.startsWith('*') && value.endsWith('*')) {
          // Wildcard search
          const searchTerm = value.slice(1, -1).toLowerCase();

          return String(itemValue).toLowerCase().includes(searchTerm);
        }

        if (Array.isArray(itemValue)) {
          return itemValue.includes(value);
        }

        return itemValue === value;
      });
    });
  }

  static applySorting<T>(data: T[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): T[] {
    if (!sortBy) {
      return data;
    }

    return [...data].sort((a: any, b: any) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  static applyPagination<T>(data: T[], page = 1, limit = 10): { data: T[]; pagination: any } {
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit)
      }
    };
  }

  static parseQueryParams(query: any): QueryParams {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100); // Max 100 per page
    const sortBy = query.sortBy;
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    // Extract filter parameters (exclude pagination and sorting)
    const filter: FilterQuery = {};
    Object.entries(query).forEach(([key, value]) => {
      if (!['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
        filter[key] = value;
      }
    });

    return { page: page.toString(), limit: limit.toString(), sortBy, sortOrder, ...filter };
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function validateJsonSchema(data: any, schema: any): { valid: boolean; errors: string[] } {
  // Simple validation - in production, use a proper schema validator like Joi or Ajv
  const errors: string[] = [];
  
  if (!schema) {
    return { valid: true, errors: [] };
  }

  // Basic type checking
  if (schema.type && typeof data !== schema.type) {
    errors.push(`Expected type ${schema.type}, got ${typeof data}`);
  }

  // Required fields checking
  if (schema.required && Array.isArray(schema.required)) {
    schema.required.forEach((field: string) => {
      if (!Object.prototype.hasOwnProperty.call(data, field)) {
        errors.push(`Required Field '${field}' is Missing`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
