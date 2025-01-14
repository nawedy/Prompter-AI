import { performanceMonitor } from './monitoring/performance';

export const performance = {
  measureInteraction: (name: string) => {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        performanceMonitor.recordMetric(`interaction.${name}`, duration);
      }
    };
  },

  markAndMeasure: (markName: string) => {
    performance.mark(markName);
    return {
      end: (measureName: string) => {
        performance.mark(`${markName}_end`);
        performance.measure(measureName, markName, `${markName}_end`);
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