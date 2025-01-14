import { appLogger } from './logger';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();

  startOperation(operation: string, metadata?: Record<string, any>) {
    const startTime = performance.now();
    this.metrics.set(operation, {
      operation,
      startTime,
      success: false,
      metadata,
    });
    return startTime;
  }

  endOperation(operation: string, success: boolean = true) {
    const metric = this.metrics.get(operation);
    if (metric) {
      const endTime = performance.now();
      metric.endTime = endTime;
      metric.duration = endTime - metric.startTime;
      metric.success = success;

      appLogger.performance(operation, metric.duration, {
        success,
        ...metric.metadata,
      });

      this.metrics.delete(operation);
      return metric.duration;
    }
    return 0;
  }

  getMetrics() {
    return Array.from(this.metrics.values());
  }
}

export const performanceMonitor = new PerformanceMonitor();