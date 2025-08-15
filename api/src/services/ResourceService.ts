import { DataRepository, QueryParams, ApiResponse, ResourceConfig } from '../types';
import { QueryUtils, validateJsonSchema } from '../utils/helpers';
import logger from '../utils/logger';

export class ResourceService {
  constructor(
    private repository: DataRepository,
    private resourceConfig: ResourceConfig
  ) {}

  async getAll(query?: QueryParams): Promise<ApiResponse> {
    try {
      const data = await this.repository.findAll(query);
      
      if (query && (query.page || query.limit)) {
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '10');
        const result = QueryUtils.applyPagination(data, page, limit);
        
        return {
          success: true,
          data: result.data,
          pagination: result.pagination
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      logger.error(`Error Fetching ${this.resourceConfig.name}:`, error);
      return {
        success: false,
        error: `Failed to Fetch ${this.resourceConfig.name}`
      };
    }
  }

  async getById(id: string): Promise<ApiResponse> {
    try {
      const item = await this.repository.findById(id);
      
      if (!item) {
        return {
          success: false,
          error: `${this.resourceConfig.name} with ID ${id} Not Found`
        };
      }

      return {
        success: true,
        data: item
      };
    } catch (error) {
      logger.error(`Error Fetching ${this.resourceConfig.name} by ID:`, error);
      return {
        success: false,
        error: `Failed to Fetch ${this.resourceConfig.name}`
      };
    }
  }

  async create(data: any): Promise<ApiResponse> {
    try {
      if (this.resourceConfig.readonly) {
        return {
          success: false,
          error: `${this.resourceConfig.name} is Read-Only`
        };
      }

      // Validate against schema if provided
      if (this.resourceConfig.schema) {
        const validation = validateJsonSchema(data, this.resourceConfig.schema);
        
        if (!validation.valid) {
          return {
            success: false,
            error: 'Validation Failed',
            message: validation.errors.join(', ')
          };
        }
      }

      const newItem = await this.repository.create(data);

      return {
        success: true,
        data: newItem,
        message: `${this.resourceConfig.name} Created Successfully`
      };
    } catch (error) {
      logger.error(`Error Creating ${this.resourceConfig.name}:`, error);

      return {
        success: false,
        error: `Failed to Create ${this.resourceConfig.name}`
      };
    }
  }

  async update(id: string, data: any): Promise<ApiResponse> {
    try {
      if (this.resourceConfig.readonly) {
        return {
          success: false,
          error: `${this.resourceConfig.name} is Read-Only`
        };
      }

      // Validate against schema if provided
      if (this.resourceConfig.schema) {
        const validation = validateJsonSchema(data, this.resourceConfig.schema);

        if (!validation.valid) {
          return {
            success: false,
            error: 'Validation Failed',
            message: validation.errors.join(', ')
          };
        }
      }

      const updatedItem = await this.repository.update(id, data);

      if (!updatedItem) {
        return {
          success: false,
          error: `${this.resourceConfig.name} with ID ${id} Not Found`
        };
      }

      return {
        success: true,
        data: updatedItem,
        message: `${this.resourceConfig.name} Updated Successfully`
      };
    } catch (error) {
      logger.error(`Error Updating ${this.resourceConfig.name}:`, error);

      return {
        success: false,
        error: `Failed to update ${this.resourceConfig.name}`
      };
    }
  }

  async delete(id: string): Promise<ApiResponse> {
    try {
      if (this.resourceConfig.readonly) {
        return {
          success: false,
          error: `${this.resourceConfig.name} is Read-Only`
        };
      }

      const deleted = await this.repository.delete(id);

      if (!deleted) {
        return {
          success: false,
          error: `${this.resourceConfig.name} with ID ${id} Not Found`
        };
      }

      return {
        success: true,
        message: `${this.resourceConfig.name} Deleted Successfully`
      };
    } catch (error) {
      logger.error(`Error Deleting ${this.resourceConfig.name}:`, error);

      return {
        success: false,
        error: `Failed to Delete ${this.resourceConfig.name}`
      };
    }
  }

  async getStats(): Promise<ApiResponse> {
    try {
      const total = await this.repository.count();

      return {
        success: true,
        data: {
          resource: this.resourceConfig.name,
          total,
          readonly: this.resourceConfig.readonly || false
        }
      };
    } catch (error) {
      logger.error(`Error Fetching ${this.resourceConfig.name} Stats:`, error);
      return {
        success: false,
        error: `Failed to Fetch ${this.resourceConfig.name} Stats`
      };
    }
  }
}
