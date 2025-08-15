import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';

export function createHealthRouter(): Router {
  const router = Router();

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     description: Returns the health status of the API
   *     responses:
   *       200:
   *         description: API is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: API is healthy
   *                 timestamp:
   *                   type: string
   *                   example: "2023-10-15T10:30:00.000Z"
   *                 uptime:
   *                   type: number
   *                   example: 123.456
   */
  router.get('/', (_req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'API is Healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
      }
    };

    res.status(200).json(response);
  });

  return router;
}
