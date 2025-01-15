import { performanceMonitor } from './monitoring/performance';
import { env } from './env';
import { performanceBudgetMonitor } from './performanceBudgets';

interface PerformanceMetric {
  name: string;
  value: number;
  startTime?: number;
  duration?: number;
  category: 'timing' | 'memory' | 'bundle' | 'network';
  unit: 'ms' | 'MB' | 'KB' | 'count';
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean;
  private memoryInterval: number | null = null;

  constructor() {
    this.isEnabled = env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
    if (this.isEnabled && import.meta.env.DEV) {
      this.startMemoryMonitoring();
      this.trackBundleSizes();
      this.trackNetworkRequests();
    }
  }

  private startMemoryMonitoring() {
    if ('memory' in performance) {
      this.memoryInterval = window.setInterval(() => {
        const memory = (performance as any).memory;
        const heapSize = Math.round(memory.usedJSHeapSize / (1024 * 1024));
        
        this.metrics.set('memory.heapSize', {
          name: 'memory.heapSize',
          value: heapSize,
          category: 'memory',
          unit: 'MB'
        });

        performanceBudgetMonitor.checkBudget('memory.heapSize', heapSize);

        this.metrics.set('memory.heapLimit', {
          name: 'memory.heapLimit',
          value: Math.round(memory.jsHeapSizeLimit / (1024 * 1024)),
          category: 'memory',
          unit: 'MB'
        });
      }, 1000);
    }
  }

  private async trackBundleSizes() {
    const manifest = await fetch('/manifest.json').catch(() => null);
    if (manifest) {
      const data = await manifest.json();
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (value.file) {
          const size = Math.round(value.size / 1024);
          this.metrics.set(`bundle.${key}`, {
            name: `bundle.${key}`,
            value: size,
            category: 'bundle',
            unit: 'KB'
          });

          performanceBudgetMonitor.checkBudget(`bundle.${key}`, size);
        }
      });
    }
  }

  private trackNetworkRequests() {
    const originalFetch = window.fetch;
    let activeRequests = 0;

    window.fetch = async (...args) => {
      const start = performance.now();
      activeRequests++;
      
      this.metrics.set('network.activeRequests', {
        name: 'network.activeRequests',
        value: activeRequests,
        category: 'network',
        unit: 'count'
      });

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        
        const metricName = `network.request.${args[0]}`;
        this.metrics.set(metricName, {
          name: metricName,
          value: duration,
          category: 'network',
          unit: 'ms'
        });

        performanceBudgetMonitor.checkBudget('network.request', duration);
        
        return response;
      } finally {
        activeRequests--;
        this.metrics.set('network.activeRequests', {
          name: 'network.activeRequests',
          value: activeRequests,
          category: 'network',
          unit: 'count'
        });
      }
    };
  }

  startMeasure(name: string) {
    if (!this.isEnabled) return;

    const startTime = performance.now();
    this.metrics.set(name, {
      name,
      value: 0,
      startTime,
      category: 'timing',
      unit: 'ms'
    });
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

    performanceBudgetMonitor.checkBudget(name, duration);

    if (import.meta.env.DEV) {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics() {
    this.metrics.clear();
  }

  exportMetrics() {
    const metrics = this.getMetrics();
    const timestamp = new Date().toISOString();
    const data = {
      timestamp,
      metrics: metrics.map(m => ({
        ...m,
        timestamp
      }))
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  dispose() {
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
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