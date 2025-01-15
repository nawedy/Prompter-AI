import { performanceMonitor } from './monitoring/performance';
import { env } from './env';

interface PerformanceMetric {
  name: string;
  value: number;
  startTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  startMeasure(name: string) {
    if (!this.isEnabled) return;

    const startTime = performance.now();
    this.metrics.set(name, { name, value: 0, startTime });
    
    // Report to Web Vitals
    if ('reportWebVitals' in window) {
      (window as any).reportWebVitals({
        name,
        value: 0,
        startTime,
      });
    }
  }

  endMeasure(name: string) {
    if (!this.isEnabled) return;

    const metric = this.metrics.get(name);
    if (!metric || !metric.startTime) return;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    this.metrics.set(name, {
      ...metric,
      value: duration,
      duration,
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }

    // Report to Web Vitals
    if ('reportWebVitals' in window) {
      (window as any).reportWebVitals({
        name,
        value: duration,
        startTime: metric.startTime,
        duration,
      });
    }
  }

  // Get all metrics
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

export const performance = {
  measureInteraction: (name: string) => {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        performanceMonitor.endMeasure(`interaction.${name}`);
      }
    };
  },

  markAndMeasure: (markName: string) => {
    performance.mark(markName);
    return {
      end: (measureName: string) => {
        performance.mark(`${markName}_end`);
        performance.measure(measureName, markName, `${markName}_end`);
        performanceMonitor.endMeasure(measureName);
      }
    };
  }
};

export const optimizeImage = (url: string, width: number) => {
  // Add image optimization parameters
  const optimizedUrl = new URL(url);
  optimizedUrl.searchParams.set('w', width.toString());
  optimizedUrl.searchParams.set('q', '75');
  optimizedUrl.searchParams.set('auto', 'format');
  return optimizedUrl.toString();
};

export const preloadCriticalAssets = () => {
  const assets = [
    '/src/index.css',
    '/src/assets/logo.svg'
  ];

  assets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.endsWith('.css') ? 'style' : 'image';
    document.head.appendChild(link);
  });
};