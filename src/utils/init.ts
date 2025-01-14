import { validateEnv } from './config/validateEnv';
import { securityMonitor } from './monitoring/securityMonitor';
import { metrics } from './monitoring/metrics';
import { preloadCriticalAssets } from './performance';

export async function initializeApp() {
  try {
    // Validate environment variables
    validateEnv();

    // Initialize security monitoring
    securityMonitor.logEvent({
      type: 'app_start',
      severity: 'low',
      details: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    });

    // Start performance monitoring
    metrics.recordTiming('app_init', performance.now());

    // Preload critical assets
    preloadCriticalAssets();

    return true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
}