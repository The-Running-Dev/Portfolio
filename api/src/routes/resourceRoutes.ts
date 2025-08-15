import { Router } from 'express';
import { ResourceController } from '../controllers/ResourceController';
import { optionalAuthenticateApiKey } from '../middleware/auth';

export function createResourceRouter(resourceController: ResourceController): Router {
  const router = Router();

  // Apply optional authentication middleware to all routes
  router.use(optionalAuthenticateApiKey);

  /**
   * @swagger
   * components:
   *   securitySchemes:
   *     ApiKeyAuth:
   *       type: apiKey
   *       in: header
   *       name: X-API-Key
   */

  /**
   * @swagger
   * /{resource}:
   *   get:
   *     summary: Get all items
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of items per page
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *         description: Field to sort by
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order
   *     responses:
   *       200:
   *         description: Successful response
   *       401:
   *         description: Unauthorized
   */
  router.get('/', (req, res) => resourceController.getAll(req as any, res));

  /**
   * @swagger
   * /{resource}/stats:
   *   get:
   *     summary: Get resource statistics
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Resource statistics
   *       401:
   *         description: Unauthorized
   */
  router.get('/stats', (req, res) => resourceController.getStats(req as any, res));

  /**
   * @swagger
   * /{resource}/{id}:
   *   get:
   *     summary: Get item by ID
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Item ID
   *     responses:
   *       200:
   *         description: Item found
   *       404:
   *         description: Item not found
   *       401:
   *         description: Unauthorized
   */
  router.get('/:id', (req, res) => resourceController.getById(req as any, res));

  /**
   * @swagger
   * /{resource}:
   *   post:
   *     summary: Create new item
   *     security:
   *       - ApiKeyAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       201:
   *         description: Item created
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  router.post('/', (req, res) => resourceController.create(req as any, res));

  /**
   * @swagger
   * /{resource}/{id}:
   *   put:
   *     summary: Update item by ID
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Item ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Item updated
   *       400:
   *         description: Bad request
   *       404:
   *         description: Item not found
   *       401:
   *         description: Unauthorized
   */
  router.put('/:id', (req, res) => resourceController.update(req as any, res));

  /**
   * @swagger
   * /{resource}/{id}:
   *   delete:
   *     summary: Delete item by ID
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Item ID
   *     responses:
   *       200:
   *         description: Item deleted
   *       404:
   *         description: Item not found
   *       401:
   *         description: Unauthorized
   */
  router.delete('/:id', (req, res) => resourceController.delete(req as any, res));

  return router;
}
