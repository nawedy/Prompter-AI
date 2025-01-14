import { performance } from 'perf_hooks';
import { metricsCollector } from './metrics';

interface ProfilerOptions {
  tags?: Record<string, string>;
  threshold?: number;
}

export function profile(name: string, options: ProfilerOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = performance.now() - start;

        // Record metric
        metricsCollector.record(`method.${name}.duration`, duration, {
          method: propertyKey,
          ...options.tags,
        });

        // Log slow operations
        if (options.threshold && duration > options.threshold) {
          metricsCollector.record(`method.${name}.slow`, duration, {
            method: propertyKey,
            ...options.tags,
          });
        }

        return result;
      } catch (error) {
        const duration = performance.now() - start;
        metricsCollector.record(`method.${name}.error`, duration, {
          method: propertyKey,
          error: error instanceof Error ? error.name : 'Unknown',
          ...options.tags,
        });
        throw error;
      }
    };

    return descriptor;
  };
}