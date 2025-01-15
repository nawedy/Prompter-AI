module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
      budgets: [
        {
          path: '/',
          timings: [
            {
              metric: 'interactive',
              budget: 3500,
            },
            {
              metric: 'first-contentful-paint',
              budget: 2000,
            },
          ],
          resourceSizes: [
            {
              resourceType: 'script',
              budget: 300,
            },
            {
              resourceType: 'total',
              budget: 1000,
            },
          ],
          resourceCounts: [
            {
              resourceType: 'third-party',
              budget: 10,
            },
          ],
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
