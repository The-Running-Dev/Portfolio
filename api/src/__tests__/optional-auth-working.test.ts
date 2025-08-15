import request from 'supertest';
import { App } from '../app';
import { Express } from 'express';
import { config } from '../config';

describe('Optional Authentication Feature Tests', () => {
  let app: Express;
  let server: App;

  beforeAll(async () => {
    server = new App();
    await server.initialize();
    app = server.getApp();
  });

  afterAll(async () => {
    // No close method needed - let Jest handle cleanup
  });

  describe(`Authentication Mode: AUTH_REQUIRED=${config.authRequired}`, () => {
    if (config.authRequired === false) {
      // Tests for when authentication is disabled
      describe('Authentication Disabled Mode', () => {
        it('should allow requests without API key', async () => {
          const response = await request(app)
            .get('/api/v1/projects');

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        });

        it('should allow requests with invalid API key', async () => {
          const response = await request(app)
            .get('/api/v1/projects')
            .set('X-API-Key', 'invalid-key');

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        });

        it('should allow requests with valid API key', async () => {
          const response = await request(app)
            .get('/api/v1/projects')
            .set('X-API-Key', config.apiKeys[0]);

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        });

        it('should allow requests with API key in query parameter', async () => {
          const response = await request(app)
            .get('/api/v1/projects')
            .query({ apikey: config.apiKeys[0] });

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        });
      });
    } else {
      // Tests for when authentication is required
      describe('Authentication Required Mode', () => {
        it('should reject requests without API key', async () => {
          const response = await request(app)
            .get('/api/v1/projects');

          expect(response.status).toBe(401);
          expect(response.body.success).toBe(false);
          expect(response.body.error).toContain('API Key is Required');
        });

        it('should reject requests with invalid API key', async () => {
          const response = await request(app)
            .get('/api/v1/projects')
            .set('X-API-Key', 'invalid-key');

          expect(response.status).toBe(401);
          expect(response.body.success).toBe(false);
          expect(response.body.error).toContain('Invalid API Key');
        });

        it('should allow requests with valid API key in header', async () => {
          const response = await request(app)
            .get('/api/v1/projects')
            .set('X-API-Key', config.apiKeys[0]);

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        });

        it('should allow requests with valid API key in query parameter', async () => {
          const response = await request(app)
            .get('/api/v1/projects')
            .query({ apikey: config.apiKeys[0] });

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
        });
      });
    }
  });

  describe('Configuration Documentation', () => {
    it('should report current authentication configuration', () => {
      console.log(`\n📋 Current Configuration:`);
      console.log(`   AUTH_REQUIRED: ${config.authRequired}`);
      console.log(`   API_KEYS: ${config.apiKeys.length} configured`);
      console.log(`   Mode: ${config.authRequired ? 'Authentication Required' : 'Authentication Optional'}`);
      
      if (!config.authRequired) {
        console.log(`\n💡 To test authentication enforcement:`);
        console.log(`   1. Set AUTH_REQUIRED=true in .env`);
        console.log(`   2. Restart the API server`);
        console.log(`   3. Run the tests again`);
      }

      expect(typeof config.authRequired).toBe('boolean');
      expect(Array.isArray(config.apiKeys)).toBe(true);
    });
  });
});
