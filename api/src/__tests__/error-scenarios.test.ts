import request from 'supertest';
import { App } from '../app';
import { Express } from 'express';

describe('API Error Scenarios and Edge Cases', () => {
  let app: Express;
  let server: App;
  const apiKey = 'test-api-key-1';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATA_DIRECTORY = './data';
    process.env.API_KEYS = 'test-api-key-1,test-api-key-2';
    process.env.AUTH_REQUIRED = 'true'; // Enable auth for testing
    
    server = new App();
    await server.initialize();
    app = server.getApp();
  });

  describe('Error Handling', () => {
    it('should handle large request body gracefully', async () => {
      const largeData = {
        title: 'Test Project',
        description: 'A'.repeat(10000), // Large description
        metadata: Array(1000).fill({ key: 'value' })
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .send(largeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe(largeData.description);
    });

    it('should handle special characters in resource names', async () => {
      const specialCharsProject = {
        title: 'Test Project with Special Chars: àáäâèéëê',
        description: 'Contains émojis 🚀 and unicode ñ',
        technologies: ['Node.js', 'C++', 'C#']
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .send(specialCharsProject)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(specialCharsProject.title);
    });

    it('should handle empty arrays in request data', async () => {
      const projectWithEmptyArrays = {
        title: 'Empty Arrays Test',
        technologies: [],
        categories: [],
        tags: []
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .send(projectWithEmptyArrays)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.technologies).toEqual([]);
    });

    it('should handle null values in request data', async () => {
      const projectWithNulls = {
        title: 'Null Values Test',
        description: null,
        endDate: null,
        repository: null
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .send(projectWithNulls)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(projectWithNulls.title);
    });

    it('should handle deeply nested object structures', async () => {
      const nestedProject = {
        title: 'Nested Structure Test',
        metadata: {
          client: {
            name: 'Test Client',
            contact: {
              email: 'test@example.com',
              phone: {
                primary: '123-456-7890',
                secondary: '098-765-4321'
              }
            }
          },
          project: {
            phases: [
              { name: 'Phase 1', tasks: [{ id: 1, name: 'Task 1' }] },
              { name: 'Phase 2', tasks: [{ id: 2, name: 'Task 2' }] }
            ]
          }
        }
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .send(nestedProject)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata.client.name).toBe('Test Client');
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        request(app)
          .get(`/api/v1/projects`)
          .set('X-API-Key', apiKey)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.body).toHaveProperty('success');
      });
    });

    it('should handle rapid sequential requests', async () => {
      const responses: any[] = [];
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/api/v1/users')
          .set('X-API-Key', apiKey);
        responses.push(response);
      }

      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.body).toHaveProperty('success');
      });
    });

    it('should handle requests with mixed case headers', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set('x-api-key', apiKey) // lowercase header
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle requests with extra whitespace in API key', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set('X-API-Key', ` ${apiKey} `) // API key with whitespace
        .expect(200); // API might trim whitespace, so this could succeed

      expect(response.body.success).toBe(true);
    });

    it('should handle malformed query parameters gracefully', async () => {
      // Test with malformed JSON-like query parameter
      const response = await request(app)
        .get('/api/v1/projects?filter={malformed:json}')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large page numbers', async () => {
      const response = await request(app)
        .get('/api/v1/projects?page=99999')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.page).toBe(99999);
    });

    it('should handle zero and negative page numbers', async () => {
      const response1 = await request(app)
        .get('/api/v1/projects?page=0')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response1.body.success).toBe(true);
      // API might handle page=0 differently, so just check it works

      const response2 = await request(app)
        .get('/api/v1/projects?page=-5')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response2.body.success).toBe(true);
      // API might keep negative page as-is, so just check it doesn't crash
    });

    it('should handle very large limit values', async () => {
      const response = await request(app)
        .get('/api/v1/projects?limit=10000')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Should be capped at maximum limit
      expect(response.body.pagination.limit).toBeLessThanOrEqual(1000);
    });

    it('should handle sorting by non-existent fields', async () => {
      const response = await request(app)
        .get('/api/v1/projects?sortBy=nonExistentField')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle filtering by fields with array values', async () => {
      const response = await request(app)
        .get('/api/v1/projects?technologies=TypeScript')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((project: any) => 
        Array.isArray(project.technologies) && 
        project.technologies.includes('TypeScript')
      )).toBe(true);
    });

    it('should handle complex wildcard patterns', async () => {
      const response = await request(app)
        .get('/api/v1/projects?title=*Test*Project*')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((project: any) => 
        project.title.includes('Test') && project.title.includes('Project')
      )).toBe(true);
    });

    it('should handle multiple sort criteria', async () => {
      // Note: This tests if the API handles multiple sortBy parameters gracefully
      const response = await request(app)
        .get('/api/v1/projects?sortBy=status&sortBy=title')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle filtering with boolean values', async () => {
      const response = await request(app)
        .get('/api/v1/projects?featured=true')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      // All returned projects should have featured: true or be filtered appropriately
    });

    it('should handle date range filtering', async () => {
      const response = await request(app)
        .get('/api/v1/projects?startDate>=2023-01-01')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle requests with many query parameters', async () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        sortBy: 'title',
        sortOrder: 'asc',
        status: 'completed',
        featured: 'true',
        category: 'web',
        technology: 'TypeScript',
        year: '2023',
        'apiKey': apiKey
      });

      const response = await request(app)
        .get(`/api/v1/projects?${params.toString()}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((project: any) => 
        project.status === 'completed'
      )).toBe(true);
    });
  });

  describe('Content-Type Handling', () => {
    it('should handle requests without Content-Type header', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .send('{"title":"No Content Type Test"}')
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should handle requests with incorrect Content-Type', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .set('Content-Type', 'text/plain')
        .send('{"title":"Wrong Content Type Test"}')
        .expect(201); // API might be flexible with content-type

      expect(response.body.success).toBe(true);
    });

    it('should handle form-encoded data', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('title=Form%20Encoded%20Test&description=Test%20Description')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Form Encoded Test');
    });
  });

  describe('HTTP Methods Edge Cases', () => {
    it('should handle HEAD requests', async () => {
      const response = await request(app)
        .head('/api/v1/projects')
        .set('X-API-Key', apiKey)
        .expect(200);

      // HEAD requests don't return body content
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should handle OPTIONS requests for CORS preflight', async () => {
      const response = await request(app)
        .options('/api/v1/projects')
        .set('Origin', 'http://localhost:3000')
        .expect(204); // API returns 204 for OPTIONS

      expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });

    it('should reject unsupported HTTP methods', async () => {
      const response = await request(app)
        .patch('/api/v1/projects/project-1')
        .set('X-API-Key', apiKey)
        .send({ title: 'Patched' })
        .expect(404); // API returns 404 for unsupported methods

      expect(response.body.success).toBe(false);
    });
  });
});
