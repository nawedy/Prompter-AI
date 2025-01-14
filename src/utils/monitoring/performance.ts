import { appLogger } from '../logger';

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics: number;
  private readonly flushInterval: number;

  constructor(maxMetrics = 1000, flushInterval = 60000) {
    this.maxMetrics = maxMetrics;
    this.flushInterval = flushInterval;
    this.startFlushInterval();
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      tags,
      timestamp: Date.now(),
    });

    if (this.metrics.length > this.maxMetrics) {
      this.flush();
    }
  }

  private startFlushInterval() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  private flush() {
    if (this.metrics.length === 0) return;

    const aggregated = this.aggregateMetrics();
    
    for (const [name, data] of Object.entries(aggregated)) {
      appLogger.performance(name, data.avg, {
        min: data.min,
        max: data.max,
        count: data.count,
        p95: this.calculatePercentile(data.values, 95),
        tags: data.tags,
      });
    }

    this.metrics = [];
  }

  private aggregateMetrics() {
    const aggregated: Record<string, {
      min: number;
      max: number;
      sum: number;
      count: number;
      avg: number;
      values: number[];
      tags: Set<string>;
    }> = {};

    for (const metric of this.metrics) {
      if (!aggregated[metric.name]) {
        aggregated[metric.name] = {
          min: Infinity,
          max: -Infinity,
          sum: 0,
          count: 0,
          avg: 0,
          values: [],
          tags: new Set(),
        };
      }

      const agg = aggregated[metric.name];
      agg.min = Math.min(agg.min, metric.value);
      agg.max = Math.max(agg.max, metric.value);
      agg.sum += metric.value;
      agg.count++;
      agg.values.push(metric.value);

      if (metric.tags) {
        Object.entries(metric.tags).forEach(([key, value]) => {
          agg.tags.add(`${key}:${value}`);
        });
      }
    }

    // Calculate averages
    for (const name of Object.keys(aggregated)) {
      const agg = aggregated[name];
      agg.avg = agg.sum / agg.count;
    }

    return aggregated;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

export const performanceMonitor = new PerformanceMonitor();