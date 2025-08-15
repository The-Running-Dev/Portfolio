import { Response } from 'express';
import { ResourceService } from '../services/ResourceService';
import { QueryUtils } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const queryParams = QueryUtils.parseQueryParams(req.query);
    const result = await this.resourceService.getAll(queryParams);
    
    const statusCode = result.success ? 200 : 400;
    res.status(statusCode).json(result);
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.resourceService.getById(id);
    const statusCode = result.success ? 200 : 404;

    res.status(statusCode).json(result);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await this.resourceService.create(req.body);
    const statusCode = result.success ? 201 : 400;

    res.status(statusCode).json(result);
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.resourceService.update(id, req.body);
    const statusCode = result.success ? 200 : result.error?.includes('not found') ? 404 : 400;
    
    res.status(statusCode).json(result);
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.resourceService.delete(id);
    const statusCode = result.success ? 200 : 404;

    res.status(statusCode).json(result);
  }

  async getStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await this.resourceService.getStats();
    const statusCode = result.success ? 200 : 400;

    res.status(statusCode).json(result);
  }
}
