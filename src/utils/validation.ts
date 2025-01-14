import { z } from 'zod';
import { ValidationError } from './errors';

// Enhanced validation rules
const commonRules = {
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
};

// Rate limiting rules
export const rateLimitRules = {
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
  maxConcurrentConnections: 5,
};

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, ''); // Remove quotes
}

// Validation wrapper
export async function validateInput<T>(schema: z.Schema<T>, data: unknown): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error);
    }
    throw error;
  }
}

// Business rules validation
export function validateBusinessRules(data: any, rules: Record<string, (data: any) => boolean>) {
  const violations = [];
  
  for (const [rule, validator] of Object.entries(rules)) {
    if (!validator(data)) {
      violations.push(rule);
    }
  }
  
  if (violations.length > 0) {
    throw new ValidationError('Business rules validation failed', 
      new z.ZodError([{
        code: 'custom',
        message: `Failed rules: ${violations.join(', ')}`,
        path: [],
      }])
    );
  }
}