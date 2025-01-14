export const testConfig = {
  // Unit testing configuration
  unit: {
    coverage: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    // Test patterns
    patterns: ['**/*.test.ts', '**/*.test.tsx'],
    // Excluded patterns
    exclude: ['**/node_modules/**', '**/dist/**'],
  },

  // Integration testing
  integration: {
    // Test timeouts
    timeout: 30000,
    // Retry attempts
    retries: 2,
    // Global setup
    globalSetup: './tests/setup/global.ts',
    // Test environment variables
    env: {
      API_URL: 'http://localhost:3000',
      TEST_DB: ':memory:',
    },
  },

  // End-to-end testing
  e2e: {
    // Browser configurations
    browsers: ['chromium', 'firefox'],
    // Viewport sizes
    viewports: [
      { width: 1920, height: 1080 },
      { width: 390, height: 844 },
    ],
    // Test scenarios
    scenarios: [
      'authentication',
      'navigation',
      'data-entry',
      'search',
      'export',
    ],
    // Screenshot configuration
    screenshots: {
      enabled: true,
      directory: './tests/screenshots',
      onFailure: true,
    },
  },

  // Performance testing
  performance: {
    // Thresholds
    thresholds: {
      // Response time in milliseconds
      responseTime: 200,
      // Requests per second
      throughput: 100,
      // Error rate percentage
      errorRate: 1,
      // Memory usage in MB
      memoryUsage: 512,
    },
    // Load test duration in seconds
    duration: 300,
    // Virtual users
    vus: 50,
  },
} as const;