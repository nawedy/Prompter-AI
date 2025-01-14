import { z } from 'zod';

export const performanceConfig = {
  // Code splitting configuration
  codeSplitting: {
    // Minimum chunk size for splitting
    minChunkSize: 20000, // bytes
    // Maximum number of parallel chunks to load
    maxParallelRequests: 5,
    // Prefetch threshold
    prefetchThreshold: 0.7, // 70% chance user will need the chunk
  },

  // Image optimization
  images: {
    formats: ['webp', 'avif'],
    sizes: [640, 750, 828, 1080, 1200, 1920],
    placeholder: 'blur',
    quality: 75,
    // Cache duration in seconds
    cacheDuration: 60 * 60 * 24 * 30, // 30 days
  },

  // Service worker
  serviceWorker: {
    // Cache strategies
    strategies: {
      assets: 'cache-first',
      api: 'network-first',
      pages: 'stale-while-revalidate',
    },
    // Offline fallback page
    offlineFallback: '/offline.html',
    // Cache duration in seconds
    cacheDuration: 60 * 60 * 24 * 7, // 7 days
  },

  // Bundle optimization
  bundleOptimization: {
    // Target bundle size in bytes
    targetSize: 100000,
    // Compression level (1-9)
    compressionLevel: 6,
    // Module concatenation
    concatenateModules: true,
    // Dead code elimination
    deadCodeElimination: true,
  },
} as const;

// Validation schema for performance metrics
export const performanceMetricsSchema = z.object({
  // Time to First Byte (TTFB)
  ttfb: z.number().min(0).max(1000),
  // First Contentful Paint (FCP)
  fcp: z.number().min(0).max(2000),
  // Largest Contentful Paint (LCP)
  lcp: z.number().min(0).max(2500),
  // First Input Delay (FID)
  fid: z.number().min(0).max(100),
  // Cumulative Layout Shift (CLS)
  cls: z.number().min(0).max(0.1),
  // Time to Interactive (TTI)
  tti: z.number().min(0).max(3500),
});