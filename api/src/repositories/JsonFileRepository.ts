import path from 'path';
import { DataRepository, QueryParams, FilterQuery } from '../types';
import { FileUtils, QueryUtils, generateId } from '../utils/helpers';
import config from '../config';
import logger from '../utils/logger';

export class JsonFileRepository implements DataRepository {
  private filePath: string;
  private resourceName: string;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.filePath = path.join(config.dataDirectory, `${resourceName}.json`);
  }

  async findAll(query?: QueryParams): Promise<any[]> {
    try {
      const exists = await FileUtils.fileExists(this.filePath);
      logger.info(`Checking file: ${this.filePath}, exists: ${exists}`);
      
      if (!exists) {
        logger.warn(`Data File Not Found: ${this.filePath}`);
        return [];
      }

      let data = await FileUtils.readJsonFile<any[]>(this.filePath);
      logger.info(`Read data from ${this.filePath}, length: ${Array.isArray(data) ? data.length : 'not array'}`);
      
      if (!Array.isArray(data)) {
        logger.warn(`Data File ${this.filePath} Does Not Contain An Array`);
        return [];
      }

      if (query) {
        logger.info(`Applying query filters: ${JSON.stringify(query)}`);
        
        // Extract filter parameters (exclude pagination, sorting, and auth parameters)
        const filterParams: FilterQuery = { ...query };
        delete filterParams.page;
        delete filterParams.limit;
        delete filterParams.offset;
        delete filterParams.sortBy;
        delete filterParams.sortOrder;
        delete filterParams.apiKey;  // Exclude API key query parameter
        delete filterParams.apikey;  // Exclude lowercase API key query parameter
        
        // Apply filtering
        data = QueryUtils.applyFiltering(data, filterParams);
        logger.info(`After filtering, data length: ${data.length}`);
        
        // Apply sorting
        data = QueryUtils.applySorting(data, query.sortBy, query.sortOrder);
        logger.info(`After sorting, data length: ${data.length}`);
      }

      return data;
    } catch (error) {
      logger.error(`Error Reading Data from ${this.filePath}:`, error);
      
      throw new Error(`Failed to Read ${this.resourceName} Data`);
    }
  }

  async findById(id: string): Promise<any | null> {
    try {
      const data = await this.findAll();
      
      return data.find(item => item.id === id) || null;
    } catch (error) {
      logger.error(`Error Finding ${this.resourceName} by ID ${id}:`, error);
      
      throw new Error(`Failed to Find ${this.resourceName}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const items = await this.findAll();
      const newItem = {
        ...data,
        id: data.id || generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      items.push(newItem);

      await FileUtils.writeJsonFile(this.filePath, items);

      logger.info(`Created New ${this.resourceName}:`, { id: newItem.id });

      return newItem;
    } catch (error) {
      logger.error(`Error Creating ${this.resourceName}:`, error);
      
      throw new Error(`Failed to Create ${this.resourceName}`);
    }
  }

  async update(id: string, data: any): Promise<any | null> {
    try {
      const items = await this.findAll();
      const index = items.findIndex(item => item.id === id);

      if (index === -1) {
        return null;
      }

      const updatedItem = {
        ...items[index],
        ...data,
        id, // Ensure ID cannot be changed
        updatedAt: new Date().toISOString()
      };

      items[index] = updatedItem;
      
      await FileUtils.writeJsonFile(this.filePath, items);

      logger.info(`Updated ${this.resourceName}:`, { id });
      
      return updatedItem;
    } catch (error) {
      logger.error(`Error Updating ${this.resourceName} ${id}:`, error);
      
      throw new Error(`Failed to Update ${this.resourceName}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const items = await this.findAll();
      const initialLength = items.length;
      const filteredItems = items.filter(item => item.id !== id);

      if (filteredItems.length === initialLength) {
        return false; // Item not found
      }

      await FileUtils.writeJsonFile(this.filePath, filteredItems);

      logger.info(`Deleted ${this.resourceName}:`, { id });
      
      return true;
    } catch (error) {
      logger.error(`Error Deleting ${this.resourceName} ${id}:`, error);
      
      throw new Error(`Failed to Delete ${this.resourceName}`);
    }
  }

  async count(filter?: FilterQuery): Promise<number> {
    try {
      const data = await this.findAll(filter);
      
      return data.length;
    } catch (error) {
      logger.error(`Error Counting ${this.resourceName}:`, error);

      throw new Error(`Failed to Count ${this.resourceName}`);
    }
  }
}
