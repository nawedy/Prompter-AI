import { metrics } from './metrics';
import { appLogger } from '../logger';

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: number;
}

export class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;
  private readonly alertThresholds = {
    failedLogins: 5,
    rateLimitViolations: 10,
    invalidTokens: 5
  };

  constructor() {
    this.startMetricsReporting();
  }

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.unshift(securityEvent);
    this.events = this.events.slice(0, this.maxEvents);

    metrics.recordApiCall(`security_event.${event.type}`, 0, 200);
    
    if (event.severity === 'high' || event.severity === 'critical') {
      this.triggerAlert(securityEvent);
    }

    this.checkThresholds();
  }

  private checkThresholds(): void {
    const recentEvents = this.getRecentEvents(15 * 60 * 1000); // Last 15 minutes

    const counts = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (counts.failedLogin >= this.alertThresholds.failedLogins) {
      this.triggerAlert({
        type: 'excessive_failed_logins',
        severity: 'high',
        details: { count: counts.failedLogin },
        timestamp: Date.now()
      });
    }

    if (counts.rateLimitViolation >= this.alertThresholds.rateLimitViolations) {
      this.triggerAlert({
        type: 'excessive_rate_limits',
        severity: 'high',
        details: { count: counts.rateLimitViolation },
        timestamp: Date.now()
      });
    }
  }

  private getRecentEvents(timeWindow: number): SecurityEvent[] {
    const now = Date.now();
    return this.events.filter(event => now - event.timestamp < timeWindow);
  }

  private triggerAlert(event: SecurityEvent): void {
    appLogger.warn('Security alert triggered', {
      type: event.type,
      severity: event.severity,
      details: event.details
    });

    // In a real system, this would integrate with your alert management system
    // For now, we'll just log it
    console.error(`🚨 SECURITY ALERT: ${event.type} (${event.severity})`);
  }

  private startMetricsReporting(): void {
    setInterval(() => {
      const recentEvents = this.getRecentEvents(5 * 60 * 1000); // Last 5 minutes
      
      const severityCounts = recentEvents.reduce((acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(severityCounts).forEach(([severity, count]) => {
        metrics.recordApiCall(`security_events.${severity}`, 0, count);
      });
    }, 5 * 60 * 1000); // Report every 5 minutes
  }
}

export const securityMonitor = new SecurityMonitor();