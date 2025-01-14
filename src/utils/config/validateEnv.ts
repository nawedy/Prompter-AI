import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  
  // Database
  DATABASE_URL: z.string().min(1),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('24h'),
  CSRF_SECRET: z.string().min(32),
  
  // Security
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  MAX_CONCURRENT_REQUESTS: z.string().transform(Number).default('10'),
  
  // Monitoring
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  METRICS_FLUSH_INTERVAL: z.string().transform(Number).default('60000'),
  PERFORMANCE_SAMPLE_RATE: z.string().transform(Number).default('0.1'),
});

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error('❌ Invalid environment variables:', error.errors);
    process.exit(1);
  }
}