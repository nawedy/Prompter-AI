import { RateLimitError } from '../../utils/errors';
import { metricsCollector } from '../../utils/monitoring/metrics';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  maxConcurrent: number;
}

interface RateLimitRecord {
  count: number;
  timestamps: number[];
  concurrent: number;
}

export class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.startCleanup();
  }

  async checkLimit(req: Request): Promise<void> {
    const key = this.getClientKey(req);
    const now = Date.now();
    
    let record = this.store.get(key);
    if (!record) {
      record = { count: 0, timestamps: [], concurrent: 0 };
      this.store.set(key, record);
    }

    // Check concurrent requests
    if (record.concurrent >= this.config.maxConcurrent) {
      metricsCollector.record('rate_limit.concurrent_exceeded', 1, { key });
      throw new RateLimitError('Too many concurrent requests');
    }

    // Clean old timestamps
    record.timestamps = record.timestamps.filter(
      time => time > now - this.config.windowMs
    );

    // Check rate limit
    if (record.timestamps.length >= this.config.maxRequests) {
      metricsCollector.record('rate_limit.window_exceeded', 1, { key });
      throw new RateLimitError('Rate limit exceeded');
    }

    // Update records
    record.timestamps.push(now);
    record.concurrent++;

    // Release concurrent lock after request completes
    try {
      await fetch(req);
    } finally {
      record.concurrent--;
    }
  }

  private getClientKey(req: Request): string {
    return req.headers.get('x-forwarded-for') || 
           req.headers.get('x-real-ip') || 
           'unknown';
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.store.entries()) {
        record.timestamps = record.timestamps.filter(
          time => time > now - this.config.windowMs
        );
        if (record.timestamps.length === 0) {
          this.store.delete(key);
        }
      }
    }, this.config.windowMs);
  }
}