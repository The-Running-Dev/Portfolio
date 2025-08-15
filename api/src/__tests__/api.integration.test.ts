import request from 'supertest';
import { App } from '../app';
import { Express } from 'express';

describe('API Integration Tests', () => {
  let app: Express;
  let server: App;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATA_DIRECTORY = './data';
    process.env.API_KEYS = 'test-api-key-1,test-api-key-2';
    
    server = new App();
    await server.initialize();
    app = server.getApp();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'API is Healthy'
      });

      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
    });
  });

  describe('Authentication', () => {
    const authRequired = process.env.AUTH_REQUIRED === 'true';
    
    if (authRequired) {
      it('should require API key for protected routes when AUTH_REQUIRED=true', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          error: expect.stringContaining('API Key')
        });
      });

      it('should reject invalid API key when AUTH_REQUIRED=true', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set('X-API-Key', 'invalid-key')
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Invalid API Key.'
        });
      });
    } else {
      it('should allow access without API key when AUTH_REQUIRED=false', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('should allow access with invalid API key when AUTH_REQUIRED=false', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set('X-API-Key', 'invalid-key')
          .expect(200);

        expect(response.body.success).toBe(true);
      });
    }

    it('should accept valid API key in header', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('X-API-Key', 'test-api-key-1')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should accept valid API key in query parameter', async () => {
      const response = await request(app)
        .get('/api/v1/users?apiKey=test-api-key-1')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should accept valid API key in query parameter (lowercase)', async () => {
      const response = await request(app)
        .get('/api/v1/users?apikey=test-api-key-1')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Users Resource', () => {
    const apiKey = 'test-api-key-1';

    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get user by ID', async () => {
      const response = await request(app)
        .get('/api/v1/users/user-1')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 'user-1');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/non-existent')
        .set('X-API-Key', apiKey)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should create new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .set('X-API-Key', apiKey)
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(newUser);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should update existing user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/api/v1/users/user-1')
        .set('X-API-Key', apiKey)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(updateData);
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/users?page=1&limit=2')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2
      });
    });

    it('should support filtering', async () => {
      const response = await request(app)
        .get('/api/v1/users?role=admin')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((user: any) => {
        expect(user.role).toBe('admin');
      });
    });

    it('should support sorting', async () => {
      const response = await request(app)
        .get('/api/v1/users?sortBy=name&sortOrder=asc')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      if (response.body.data.length > 1) {
        for (let i = 1; i < response.body.data.length; i++) {
          expect(response.body.data[i - 1].name <= response.body.data[i].name).toBe(true);
        }
      }
    });

    it('should get user stats', async () => {
      const response = await request(app)
        .get('/api/v1/users/stats')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('resource', 'users');
      expect(response.body.data).toHaveProperty('total');
      expect(typeof response.body.data.total).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent')
        .set('X-API-Key', 'test-api-key-1')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Not Found');
    });
  });
});
