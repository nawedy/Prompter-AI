import { lazy } from 'react';
import { performanceMonitor } from '../../utils/performance';

const withPerformanceTracking = (
  importFn: () => Promise<any>,
  componentName: string
) => {
  return () => {
    performanceMonitor.startMeasure(`load.${componentName}`);
    return importFn().then((module) => {
      performanceMonitor.endMeasure(`load.${componentName}`);
      return module;
    });
  };
};

export const ModelUsage = lazy(
  withPerformanceTracking(
    () => import('./widgets/ModelUsage'),
    'ModelUsage'
  )
);

export const TemplateUsage = lazy(
  withPerformanceTracking(
    () => import('./widgets/TemplateUsage'),
    'TemplateUsage'
  )
);

export const RecentPrompts = lazy(
  withPerformanceTracking(
    () => import('./RecentPrompts'),
    'RecentPrompts'
  )
);
