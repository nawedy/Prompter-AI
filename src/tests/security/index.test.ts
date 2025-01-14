import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { SecurityMiddleware } from '../../middleware/security';
import { RateLimiter } from '../../middleware/security/rateLimiter';
import { CsrfProtection } from '../../middleware/security/csrfProtection';
import { InputValidation } from '../../middleware/security/inputValidation';

describe('Security Middleware', () => {
  let security: SecurityMiddleware;

  beforeEach(() => {
    security = new SecurityMiddleware();
  });

  describe('Rate Limiting', () => {
    test('should block requests exceeding rate limit', async () => {
      const requests = Array(101).fill(null).map(() => 
        security.handleRequest(new Request('http://localhost'))
      );
      
      const responses = await Promise.all(requests);
      const blockedRequests = responses.filter(r => r.status === 429);
      
      expect(blockedRequests.length).toBeGreaterThan(0);
    });

    test('should allow requests within rate limit', async () => {
      const requests = Array(50).fill(null).map(() => 
        security.handleRequest(new Request('http://localhost'))
      );
      
      const responses = await Promise.all(requests);
      const successRequests = responses.filter(r => r.status === 200);
      
      expect(successRequests.length).toBe(50);
    });
  });

  describe('CSRF Protection', () => {
    test('should reject requests without CSRF token', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await security.handleRequest(request);
      expect(response.status).toBe(401);
    });

    test('should accept requests with valid CSRF token', async () => {
      const token = crypto.randomUUID();
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': token,
          'cookie': `csrf=${token}`
        }
      });

      const response = await security.handleRequest(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Input Validation', () => {
    test('should sanitize malicious input', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '<script>alert("xss")</script>'
        })
      });

      const response = await security.handleRequest(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.content).not.toContain('<script>');
    });
  });
});