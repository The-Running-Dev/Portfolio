#!/usr/bin/env node
/**
 * Demo script to test Optional Authentication Feature
 * 
 * This script demonstrates the optional authentication functionality
 * by testing API endpoints in both modes:
 * 1. AUTH_REQUIRED=false (optional authentication)
 * 2. AUTH_REQUIRED=true (required authentication)
 */

const http = require('http');

const API_BASE = 'http://localhost:3001';
const VALID_API_KEY = 'test-api-key-1';
const INVALID_API_KEY = 'invalid-key';

function makeRequest(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'GET',
      headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testEndpoint(description, path, headers = {}) {
  try {
    const result = await makeRequest(path, headers);
    const status = result.status === 200 ? '✅' : result.status === 401 ? '🔒' : '❌';
    console.log(`  ${status} ${description}: ${result.status} (${result.data.success ? 'Success' : result.data.message || 'Failed'})`);
    return result;
  } catch (error) {
    console.log(`  ❌ ${description}: Error - ${error.message}`);
    return null;
  }
}

async function runDemo() {
  console.log('🚀 Optional Authentication Feature Demo');
  console.log('=' .repeat(50));
  
  // Test current configuration
  console.log('\n📋 Testing Current Configuration (AUTH_REQUIRED=false)');
  console.log('-'.repeat(50));
  
  await testEndpoint('No API Key', '/api/v1/projects');
  await testEndpoint('Invalid API Key', '/api/v1/projects', { 'X-API-Key': INVALID_API_KEY });
  await testEndpoint('Valid API Key', '/api/v1/projects', { 'X-API-Key': VALID_API_KEY });
  await testEndpoint('API Key in Query', '/api/v1/projects?apikey=' + VALID_API_KEY);
  
  // Test health endpoint
  console.log('\n🏥 Health Check');
  console.log('-'.repeat(50));
  const health = await testEndpoint('Health Endpoint', '/api/v1/health');
  
  if (health && health.data.success) {
    console.log(`  📊 Server Uptime: ${Math.round(health.data.data.uptime)}s`);
    console.log(`  📝 Version: ${health.data.data.version}`);
  }
  
  console.log('\n💡 Configuration Instructions:');
  console.log('-'.repeat(50));
  console.log('  To test with AUTH_REQUIRED=true:');
  console.log('  1. Set AUTH_REQUIRED=true in .env file');
  console.log('  2. Restart the server');
  console.log('  3. Run this demo again');
  console.log('  4. Requests without valid API keys will return 401');
  
  console.log('\n✅ Demo completed successfully!');
}

if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };
