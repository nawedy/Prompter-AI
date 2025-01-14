import { securityConfig } from '../config/security';
import { appLogger } from './logger';
import { metricsCollector } from './monitoring/metrics';

export class SecurityUtils {
  static generateSecureToken(length: number = securityConfig.csrf.tokenLength): string {
    const buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);
    return Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove potential script injection
      .replace(/data:/gi, '') // Remove data URLs
      .replace(/\b(on\w+)=/gi, '') // Remove event handlers
      .trim();
  }

  static validateFileUpload(file: File): boolean {
    if (file.size > securityConfig.validation.maxFileSize) {
      appLogger.warn('File size exceeds limit', { size: file.size });
      return false;
    }

    if (!securityConfig.validation.allowedFileTypes.includes(file.type)) {
      appLogger.warn('Invalid file type', { type: file.type });
      return false;
    }

    return true;
  }

  static generateSecurityHeaders(): Headers {
    const headers = new Headers();

    // Content Security Policy
    const csp = Object.entries(securityConfig.headers.contentSecurityPolicy.directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
    headers.set('Content-Security-Policy', csp);

    // Other security headers
    headers.set('X-Frame-Options', securityConfig.headers.frameOptions);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-XSS-Protection', securityConfig.headers.xssProtection);
    headers.set('Referrer-Policy', securityConfig.headers.referrerPolicy);

    // Permissions Policy
    const permissions = Object.entries(securityConfig.headers.permissionsPolicy)
      .map(([feature, values]) => `${feature}=(${values.join(' ')})`)
      .join(', ');
    headers.set('Permissions-Policy', permissions);

    // HSTS
    if (process.env.NODE_ENV === 'production') {
      const hsts = [
        `max-age=${securityConfig.headers.hsts.maxAge}`,
        securityConfig.headers.hsts.includeSubDomains ? 'includeSubDomains' : '',
        securityConfig.headers.hsts.preload ? 'preload' : '',
      ].filter(Boolean).join('; ');
      headers.set('Strict-Transport-Security', hsts);
    }

    return headers;
  }

  static logSecurityEvent(
    eventType: string,
    details: Record<string, any>,
    severity: 'info' | 'warn' | 'error' = 'info'
  ): void {
    appLogger[severity](`Security event: ${eventType}`, details);
    metricsCollector.record(`security.${eventType}`, 1, details);
  }
}