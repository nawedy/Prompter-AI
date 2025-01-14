import { appLogger } from '../logger';

export const auditLogger = {
  log: (action: string, userId: string, details: Record<string, any>) => {
    appLogger.info('Audit event', {
      action,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
  },

  security: (event: string, details: Record<string, any>) => {
    appLogger.warn('Security event', {
      event,
      details,
      timestamp: new Date().toISOString()
    });
  }
};