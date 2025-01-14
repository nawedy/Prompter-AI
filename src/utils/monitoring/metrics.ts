import { performanceMonitor } from './performance';

export const metrics = {
  recordTiming: (name: string, duration: number) => {
    performanceMonitor.recordMetric(`timing.${name}`, duration);
  },

  recordError: (type: string, error: Error) => {
    performanceMonitor.recordMetric(`error.${type}`, 1);
  },

  recordApiCall: (endpoint: string, duration: number, status: number) => {
    performanceMonitor.recordMetric(`api.${endpoint}`, duration, {
      status: status.toString()
    });
  }
};