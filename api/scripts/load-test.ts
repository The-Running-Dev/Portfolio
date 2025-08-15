import { performance } from 'perf_hooks';
import request from 'supertest';
import { App } from '../src/app';

interface LoadTestConfig {
  concurrency: number;
  requests: number;
  duration: number; // in seconds
  endpoint: string;
  apiKey: string;
}

interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  duration: number;
}

class LoadTester {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    console.log(`Starting load test with ${config.concurrency} concurrent users...`);
    console.log(`Target: ${config.endpoint}`);
    console.log(`Duration: ${config.duration}s`);

    const startTime = performance.now();
    const endTime = startTime + (config.duration * 1000);
    
    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    const responseTimes: number[] = [];

    const workers: Promise<void>[] = [];

    for (let i = 0; i < config.concurrency; i++) {
      workers.push(this.createWorker(config, endTime, (success, responseTime) => {
        totalRequests++;
        if (success) {
          successfulRequests++;
        } else {
          failedRequests++;
        }
        responseTimes.push(responseTime);
      }));
    }

    await Promise.all(workers);

    const actualDuration = (performance.now() - startTime) / 1000;
    
    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      requestsPerSecond: totalRequests / actualDuration,
      duration: actualDuration
    };
  }

  private async createWorker(
    config: LoadTestConfig, 
    endTime: number, 
    callback: (success: boolean, responseTime: number) => void
  ): Promise<void> {
    while (performance.now() < endTime) {
      const requestStart = performance.now();
      
      try {
        const response = await request(this.app)
          .get(config.endpoint)
          .set('X-API-Key', config.apiKey);

        const responseTime = performance.now() - requestStart;
        const success = response.status >= 200 && response.status < 400;
        callback(success, responseTime);

      } catch (error) {
        const responseTime = performance.now() - requestStart;
        callback(false, responseTime);
      }

      // Small delay to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  printResults(result: LoadTestResult): void {
    console.log('\n=== Load Test Results ===');
    console.log(`Total Requests: ${result.totalRequests}`);
    console.log(`Successful: ${result.successfulRequests} (${((result.successfulRequests / result.totalRequests) * 100).toFixed(2)}%)`);
    console.log(`Failed: ${result.failedRequests} (${((result.failedRequests / result.totalRequests) * 100).toFixed(2)}%)`);
    console.log(`Average Response Time: ${result.averageResponseTime.toFixed(2)}ms`);
    console.log(`Min Response Time: ${result.minResponseTime.toFixed(2)}ms`);
    console.log(`Max Response Time: ${result.maxResponseTime.toFixed(2)}ms`);
    console.log(`Requests/Second: ${result.requestsPerSecond.toFixed(2)}`);
    console.log(`Test Duration: ${result.duration.toFixed(2)}s`);
  }
}

async function runLoadTest(): Promise<void> {
  // Set up test environment
  process.env.NODE_ENV = 'test';
  process.env.API_KEYS = 'load-test-api-key';
  process.env.RATE_LIMIT_MAX_REQUESTS = '1000';
  process.env.LOG_LEVEL = 'error'; // Reduce logging during load test

  const app = new App();
  await app.initialize();
  const expressApp = app.getApp();

  const loadTester = new LoadTester(expressApp);

  const config: LoadTestConfig = {
    concurrency: 10,
    requests: 1000,
    duration: 30,
    endpoint: '/api/v1/users',
    apiKey: 'load-test-api-key'
  };

  try {
    const result = await loadTester.runLoadTest(config);
    loadTester.printResults(result);
  } catch (error) {
    console.error('Load test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runLoadTest().catch(console.error);
}

export { LoadTester, LoadTestConfig, LoadTestResult };
