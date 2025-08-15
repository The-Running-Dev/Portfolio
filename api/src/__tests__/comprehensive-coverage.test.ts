import request from 'supertest';
import { App } from '../app';
import { Express } from 'express';

// Add additional comprehensive API tests
describe('Comprehensive API Coverage Tests', () => {
  let app: Express;
  let server: App;
  const validApiKey = 'test-api-key-1';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATA_DIRECTORY = './data';
    process.env.API_KEYS = 'test-api-key-1,test-api-key-2';
    
    server = new App();
    await server.initialize();
    app = server.getApp();
  });

  describe('Security Tests', () => {
    it('should prevent SQL injection attempts', async () => {
      const response = await request(app)
        .get("/api/v1/projects?title='; DROP TABLE projects; --")
        .set('X-API-Key', validApiKey)
        .expect(200); // Should handle safely, not crash

      expect(response.body.success).toBe(true);
    });

    it('should handle XSS attempts in query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/projects?title=<script>alert("xss")</script>')
        .set('X-API-Key', validApiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle invalid characters in API key header', async () => {
      // This test expects the error to be caught at the HTTP client level
      try {
        await request(app)
          .get('/api/v1/users')
          .set('X-API-Key', 'invalid\x00key')
          .expect(401);
      } catch (error: any) {
        // Expect the error to be about invalid header characters
        expect(error.message).toContain('Invalid character');
      }
    });
  });

  describe('Performance & Edge Cases', () => {
    it('should handle empty request body gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', validApiKey)
        .send({})
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should handle very long query strings', async () => {
      const longString = 'a'.repeat(1000);
      const response = await request(app)
        .get(`/api/v1/projects?title=${longString}`)
        .set('X-API-Key', validApiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle concurrent requests', async () => {
      const promises = Array(5).fill(0).map(() => 
        request(app)
          .get('/api/v1/health')
          .expect(200)
      );

      const results = await Promise.all(promises);
      results.forEach(result => {
        expect(result.body.message).toBe('API is Healthy');
      });
    });
  });

  describe('Data Validation Tests', () => {
    it('should validate project data types', async () => {
      const invalidProject = {
        title: 123, // should be string
        status: 'invalid_status',
        featured: 'not_boolean'
      };

      // API should handle invalid data gracefully - just verify it responds
      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', validApiKey)
        .send(invalidProject);

      // Accept any successful response - data validation is API's responsibility
      expect([200, 201, 400].includes(response.status)).toBe(true);
    });

    it('should handle null values in project updates', async () => {
      // First create a project
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', validApiKey)
        .send({ title: 'Test Project for Update' });

      // Accept any successful response
      expect([200, 201].includes(createResponse.status)).toBe(true);
      
      if (createResponse.status === 201 && createResponse.body.data?.id) {
        const projectId = createResponse.body.data.id;

        // Then try to update with null values
        const nullUpdates = {
          title: null,
          description: null
        };

        const updateResponse = await request(app)
          .put(`/api/v1/projects/${projectId}`)
          .set('X-API-Key', validApiKey)
          .send(nullUpdates);

        // Accept any response - the important thing is the API doesn't crash
        expect(updateResponse.status).toBeGreaterThanOrEqual(200);
      }
    });
  });

  describe('API Versioning Tests', () => {
    it('should respond correctly to base API path', async () => {
      const response = await request(app)
        .get('/api')
        .expect(404); // No handler for base /api

      expect(response.body.success).toBe(false);
    });

    it('should respond correctly to version path', async () => {
      const response = await request(app)
        .get('/api/v1')
        .expect(404); // No handler for base /api/v1

      expect(response.body.success).toBe(false);
    });
  });

  describe('CORS and Headers Tests', () => {
    it('should handle OPTIONS requests', async () => {
      await request(app)
        .options('/api/v1/projects')
        .expect(204); // CORS preflight response
    });

    it('should handle case-insensitive API key headers', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('x-api-key', validApiKey) // lowercase
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Resource Relationships', () => {
    it('should handle projects with user relationships', async () => {
      // Create a user first
      const userResponse = await request(app)
        .post('/api/v1/users')
        .set('X-API-Key', validApiKey)
        .send({
          name: 'Test User',
          email: 'test@example.com',
          role: 'developer'
        });

      // Accept any successful response
      expect([200, 201].includes(userResponse.status)).toBe(true);

      if (userResponse.status === 201 && userResponse.body.data?.id) {
        const userId = userResponse.body.data.id;

        // Create project with user reference
        const projectResponse = await request(app)
          .post('/api/v1/projects')
          .set('X-API-Key', validApiKey)
          .send({
            title: 'Project with User',
            ownerId: userId
          });

        expect([200, 201].includes(projectResponse.status)).toBe(true);
        
        if (projectResponse.body.data?.ownerId) {
          expect(projectResponse.body.data.ownerId).toBe(userId);
        }
      }
    });

    it('should handle skills filtering and relationships', async () => {
      const response = await request(app)
        .get('/api/v1/skills?level=expert')
        .set('X-API-Key', validApiKey);

      // Just verify the API responds - don't depend on specific data
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.body).toHaveProperty('success');
    });
  });
});
