import { appLogger } from '../logger';
import { performanceMonitor } from './performance';

interface QueryMetrics {
  sql: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

class QueryMonitor {
  private metrics: QueryMetrics[] = [];
  private readonly slowQueryThreshold: number;
  private readonly maxMetrics: number;

  constructor(slowQueryThreshold = 100, maxMetrics = 1000) {
    this.slowQueryThreshold = slowQueryThreshold;
    this.maxMetrics = maxMetrics;
  }

  recordQuery(sql: string, duration: number, success: boolean) {
    this.metrics.push({
      sql,
      duration,
      timestamp: Date.now(),
      success,
    });

    if (duration > this.slowQueryThreshold) {
      this.handleSlowQuery(sql, duration);
    }

    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    performanceMonitor.recordMetric('query_duration', duration);
  }

  private handleSlowQuery(sql: string, duration: number) {
    appLogger.warn('Slow query detected', {
      sql,
      duration,
      threshold: this.slowQueryThreshold,
    });

    // Analyze query pattern
    const queryPattern = this.analyzeQueryPattern(sql);
    performanceMonitor.recordMetric('slow_query_pattern', 1, { pattern: queryPattern });
  }

  private analyzeQueryPattern(sql: string): string {
    // Simplify SQL to identify patterns
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\d+/g, 'N')
      .replace(/'[^']*'/g, '?')
      .replace(/"[^"]*"/g, '?')
      .trim();
  }

  getMetrics(options: { 
    minutes?: number;
    pattern?: string;
    minDuration?: number;
  } = {}) {
    let filtered = [...this.metrics];

    if (options.minutes) {
      const cutoff = Date.now() - (options.minutes * 60 * 1000);
      filtered = filtered.filter(m => m.timestamp >= cutoff);
    }

    if (options.pattern) {
      filtered = filtered.filter(m => 
        this.analyzeQueryPattern(m.sql).includes(options.pattern)
      );
    }

    if (options.minDuration) {
      filtered = filtered.filter(m => m.duration >= options.minDuration);
    }

    return {
      count: filtered.length,
      averageDuration: this.calculateAverage(filtered.map(m => m.duration)),
      slowQueries: filtered.filter(m => m.duration > this.slowQueryThreshold).length,
      successRate: this.calculateSuccessRate(filtered),
      patterns: this.identifyCommonPatterns(filtered),
    };
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.length > 0
      ? numbers.reduce((a, b) => a + b, 0) / numbers.length
      : 0;
  }

  private calculateSuccessRate(metrics: QueryMetrics[]): number {
    if (metrics.length === 0) return 0;
    const successful = metrics.filter(m => m.success).length;
    return (successful / metrics.length) * 100;
  }

  private identifyCommonPatterns(metrics: QueryMetrics[]): Record<string, number> {
    const patterns: Record<string, number> = {};
    
    metrics.forEach(m => {
      const pattern = this.analyzeQueryPattern(m.sql);
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    });

    return patterns;
  }
}

export const queryMonitor = new QueryMonitor();