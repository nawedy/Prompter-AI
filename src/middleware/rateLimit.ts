import { RateLimitError } from '../utils/errors';
import { metricsCollector } from '../utils/monitoring/metrics';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();
  private options: RateLimitOptions;

  constructor(options: Partial<RateLimitOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    this.startCleanup();
  }

  middleware = async (req: Request): Promise<void> => {
    const key = this.options.keyGenerator?.(req) || req.headers.get('x-forwarded-for') || 'default';
    const now = Date.now();

    let record = this.store.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + this.options.windowMs };
      this.store.set(key, record);
    }

    if (record.count >= this.options.max) {
      metricsCollector.record('rate_limit.exceeded', 1, { key });
      throw new RateLimitError('Too many requests');
    }

    record.count++;
    metricsCollector.record('rate_limit.request', 1, { key });
  };

  private startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.store.entries()) {
        if (now > record.resetTime) {
          this.store.delete(key);
        }
      }
    }, this.options.windowMs);
  }
}