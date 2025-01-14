import { describe, test } from 'vitest';
import { SecurityMiddleware } from '../../middleware/security';
import { performanceMonitor } from '../../utils/monitoring/performance';

describe('Load Testing', () => {
  test('should handle concurrent requests within limits', async () => {
    const security = new SecurityMiddleware();
    const concurrentRequests = 100;
    const requestsPerBatch = 10;
    const delayBetweenBatches = 1000; // 1 second

    const results = {
      success: 0,
      rateLimit: 0,
      other: 0
    };

    for (let i = 0; i < concurrentRequests; i += requestsPerBatch) {
      const batch = Array(requestsPerBatch).fill(null).map(() => 
        security.handleRequest(new Request('http://localhost'))
          .then(response => {
            if (response.status === 200) results.success++;
            else if (response.status === 429) results.rateLimit++;
            else results.other++;
          })
      );

      await Promise.all(batch);
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }

    performanceMonitor.recordMetric('load_test.success_rate', 
      (results.success / concurrentRequests) * 100
    );
  });

  test('should maintain response times under load', async () => {
    const security = new SecurityMiddleware();
    const samples = [];
    const iterations = 50;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await security.handleRequest(new Request('http://localhost'));
      const duration = performance.now() - start;
      samples.push(duration);
    }

    const avgResponseTime = samples.reduce((a, b) => a + b, 0) / samples.length;
    performanceMonitor.recordMetric('load_test.avg_response_time', avgResponseTime);
  });
});