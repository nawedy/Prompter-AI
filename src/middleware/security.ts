import { AuthenticationError } from '../utils/errors';
import { appLogger } from '../utils/logger';

interface SecurityConfig {
  csrfSecret: string;
  allowedOrigins: string[];
  maxTokenAge: number;
}

export class SecurityMiddleware {
  constructor(private config: SecurityConfig) {}

  csrfProtection = async (req: Request): Promise<void> => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const token = req.headers.get('x-csrf-token');
      const cookie = req.headers.get('cookie')?.match(/csrf=([^;]+)/)?.[1];

      if (!token || !cookie || token !== cookie) {
        throw new AuthenticationError('Invalid CSRF token');
      }
    }
  };

  cors = (req: Request): Response | null => {
    const origin = req.headers.get('origin');
    
    if (origin && !this.config.allowedOrigins.includes(origin)) {
      return new Response(null, { status: 403 });
    }

    const headers = new Headers({
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-csrf-token',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    });

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    return null;
  };

  securityHeaders = (res: Response): Response => {
    const headers = new Headers(res.headers);
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self';");
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers
    });
  };

  validateInput = (input: unknown, schema: unknown): boolean => {
    // Implement input validation using zod schemas
    return true;
  };
}