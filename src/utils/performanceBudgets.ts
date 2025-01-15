interface PerformanceBudget {
  metric: string;
  budget: number;
  unit: string;
}

interface PerformanceAlert {
  metric: string;
  value: number;
  budget: number;
  timestamp: string;
  severity: 'warning' | 'error';
}

const BUDGETS: Record<string, PerformanceBudget> = {
  // Timing budgets
  'timing.componentLoad': { metric: 'Component Load Time', budget: 500, unit: 'ms' },
  'timing.interaction': { metric: 'Interaction Time', budget: 100, unit: 'ms' },
  'timing.render': { metric: 'Render Time', budget: 300, unit: 'ms' },
  
  // Memory budgets
  'memory.heapSize': { metric: 'Heap Size', budget: 200, unit: 'MB' },
  
  // Bundle size budgets
  'bundle.main': { metric: 'Main Bundle', budget: 250, unit: 'KB' },
  'bundle.vendor': { metric: 'Vendor Bundle', budget: 500, unit: 'KB' },
  
  // Network budgets
  'network.request': { metric: 'API Request', budget: 1000, unit: 'ms' },
};

class PerformanceBudgetMonitor {
  private alerts: PerformanceAlert[] = [];
  private listeners: ((alert: PerformanceAlert) => void)[] = [];
  private persistedMetrics: Record<string, number[]> = {};
  private readonly METRICS_HISTORY_SIZE = 100;

  checkBudget(metricName: string, value: number): void {
    const budget = BUDGETS[metricName];
    if (!budget) return;

    this.persistMetric(metricName, value);

    const percentageOverBudget = ((value - budget.budget) / budget.budget) * 100;
    
    if (percentageOverBudget > 50) {
      this.createAlert(metricName, value, budget.budget, 'error');
    } else if (percentageOverBudget > 20) {
      this.createAlert(metricName, value, budget.budget, 'warning');
    }
  }

  private persistMetric(metricName: string, value: number): void {
    if (!this.persistedMetrics[metricName]) {
      this.persistedMetrics[metricName] = [];
    }

    this.persistedMetrics[metricName].push(value);
    
    // Keep only the last N values
    if (this.persistedMetrics[metricName].length > this.METRICS_HISTORY_SIZE) {
      this.persistedMetrics[metricName].shift();
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('performanceMetrics', JSON.stringify(this.persistedMetrics));
    } catch (e) {
      console.warn('Failed to persist metrics to localStorage:', e);
    }
  }

  private createAlert(metricName: string, value: number, budget: number, severity: 'warning' | 'error'): void {
    const alert: PerformanceAlert = {
      metric: BUDGETS[metricName].metric,
      value,
      budget,
      timestamp: new Date().toISOString(),
      severity,
    };

    this.alerts.push(alert);
    this.notifyListeners(alert);
  }

  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(alert: PerformanceAlert): void {
    this.listeners.forEach(listener => listener(alert));
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  getMetricHistory(metricName: string): number[] {
    return this.persistedMetrics[metricName] || [];
  }

  getMetricTrend(metricName: string): 'improving' | 'stable' | 'degrading' | null {
    const history = this.getMetricHistory(metricName);
    if (history.length < 2) return null;

    const recentValues = history.slice(-10);
    const firstHalf = recentValues.slice(0, 5);
    const secondHalf = recentValues.slice(-5);

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (percentChange < -10) return 'improving';
    if (percentChange > 10) return 'degrading';
    return 'stable';
  }

  clearAlerts(): void {
    this.alerts = [];
  }
}

export const performanceBudgetMonitor = new PerformanceBudgetMonitor();
