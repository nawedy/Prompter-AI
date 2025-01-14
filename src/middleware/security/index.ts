import { RateLimiter } from './rateLimiter';
import { csrfProtection } from './csrf';
import { securityHeaders } from './headers';
import { sanitizeInput } from '../../utils/validation/inputSanitizer';
import { auditLogger } from '../../utils/monitoring/audit';
import { metrics } from '../../utils/monitoring/metrics';

export class SecurityMiddleware {
  private rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new RateLimiter({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 900000,
      maxRequests: Number(process.env.RATE_LIMIT_MAX) || 100,
      maxConcurrent: Number(process.env.MAX_CONCURRENT_REQUESTS) || 10
    });
  }

  async handleRequest(req: Request): Promise<Response> {
    const startTime = performance.now();
    
    try {
      // 1. Rate limiting
      await this.rateLimiter.checkLimit(req);

      // 2. CSRF protection for mutations
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const token = req.headers.get('x-csrf-token');
        const storedToken = req.headers.get('cookie')?.match(/csrf=([^;]+)/)?.[1];
        csrfProtection.validateToken(token || '', storedToken || '');
      }

      // 3. Process request
      const response = await fetch(req);
      
      // 4. Add security headers
      const headers = new Headers(response.headers);
      Object.entries(securityHeaders.getHeaders()).forEach(([key, value]) => {
        headers.set(key, value);
      });

      // 5. Log and metrics
      const duration = performance.now() - startTime;
      metrics.recordApiCall(new URL(req.url).pathname, duration, response.status);
      auditLogger.log('api_request', 'system', {
        method: req.method,
        path: new URL(req.url).pathname,
        status: response.status,
        duration
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });

    } catch (error) {
      auditLogger.security('security_violation', {
        error: error.message,
        path: new URL(req.url).pathname
      });
      throw error;
    }
  }
}

export const security = new SecurityMiddleware();