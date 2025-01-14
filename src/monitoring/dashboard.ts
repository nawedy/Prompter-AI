import { metricsCollector } from '../utils/monitoring/metrics';
import { performanceMonitor } from '../utils/monitoring/performance';
import { queryMonitor } from '../utils/monitoring/queryMonitor';
import { appLogger } from '../utils/logger';

interface SecurityMetrics {
  rateLimiting: {
    totalRequests: number;
    blockedRequests: number;
    uniqueIPs: number;
  };
  csrf: {
    validTokens: number;
    invalidTokens: number;
    expiredTokens: number;
  };
  inputValidation: {
    totalValidations: number;
    failedValidations: number;
    sanitizedInputs: number;
  };
}

export class SecurityDashboard {
  private updateInterval: number = 5000; // 5 seconds
  private metrics: SecurityMetrics = {
    rateLimiting: { totalRequests: 0, blockedRequests: 0, uniqueIPs: 0 },
    csrf: { validTokens: 0, invalidTokens: 0, expiredTokens: 0 },
    inputValidation: { totalValidations: 0, failedValidations: 0, sanitizedInputs: 0 }
  };

  constructor() {
    this.startMetricsCollection();
  }

  private startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
      this.generateReport();
    }, this.updateInterval);
  }

  private async collectMetrics() {
    // Collect rate limiting metrics
    const rateLimitMetrics = metricsCollector.getMetrics({
      name: 'rate_limit',
      minutes: 5
    });

    this.metrics.rateLimiting = {
      totalRequests: rateLimitMetrics.total || 0,
      blockedRequests: rateLimitMetrics.blocked || 0,
      uniqueIPs: rateLimitMetrics.uniqueKeys || 0
    };

    // Collect CSRF metrics
    const csrfMetrics = metricsCollector.getMetrics({
      name: 'csrf',
      minutes: 5
    });

    this.metrics.csrf = {
      validTokens: csrfMetrics.valid || 0,
      invalidTokens: csrfMetrics.invalid || 0,
      expiredTokens: csrfMetrics.expired || 0
    };

    // Collect input validation metrics
    const validationMetrics = metricsCollector.getMetrics({
      name: 'input_validation',
      minutes: 5
    });

    this.metrics.inputValidation = {
      totalValidations: validationMetrics.total || 0,
      failedValidations: validationMetrics.failed || 0,
      sanitizedInputs: validationMetrics.sanitized || 0
    };
  }

  private generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      performance: {
        averageResponseTime: performanceMonitor.getAverageResponseTime(),
        p95ResponseTime: performanceMonitor.getPercentileResponseTime(95),
        slowQueries: queryMonitor.getSlowQueries()
      },
      alerts: this.generateAlerts()
    };

    appLogger.info('Security metrics report', report);
  }

  private generateAlerts() {
    const alerts = [];

    // Rate limiting alerts
    if (this.metrics.rateLimiting.blockedRequests > 100) {
      alerts.push({
        level: 'warning',
        message: 'High number of blocked requests detected',
        metric: 'rate_limiting.blocked_requests',
        value: this.metrics.rateLimiting.blockedRequests
      });
    }

    // CSRF alerts
    if (this.metrics.csrf.invalidTokens > 50) {
      alerts.push({
        level: 'warning',
        message: 'High number of invalid CSRF tokens detected',
        metric: 'csrf.invalid_tokens',
        value: this.metrics.csrf.invalidTokens
      });
    }

    // Input validation alerts
    if (this.metrics.inputValidation.failedValidations > 100) {
      alerts.push({
        level: 'warning',
        message: 'High number of failed input validations detected',
        metric: 'input_validation.failed_validations',
        value: this.metrics.inputValidation.failedValidations
      });
    }

    return alerts;
  }
}