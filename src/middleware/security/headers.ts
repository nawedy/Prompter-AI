import { securityConfig } from '../../config/security';

export const securityHeaders = {
  getHeaders: () => ({
    'Content-Security-Policy': Object.entries(securityConfig.headers.contentSecurityPolicy.directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  })
};