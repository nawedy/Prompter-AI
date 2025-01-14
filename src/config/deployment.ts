export const deploymentConfig = {
  // CI/CD pipeline configuration
  pipeline: {
    // Stages and their order
    stages: [
      'lint',
      'test',
      'build',
      'deploy',
      'monitor',
    ],
    // Environment configurations
    environments: {
      development: {
        url: 'https://dev.example.com',
        autoDeployBranch: 'develop',
      },
      staging: {
        url: 'https://staging.example.com',
        autoDeployBranch: 'release/*',
      },
      production: {
        url: 'https://example.com',
        autoDeployBranch: 'main',
        approvalRequired: true,
      },
    },
  },

  // Environment configuration
  environment: {
    // Required environment variables
    required: [
      'DATABASE_URL',
      'API_KEY',
      'JWT_SECRET',
    ],
    // Feature flags
    features: {
      enableCache: true,
      enableMetrics: true,
      enableTracing: true,
    },
  },

  // Health check configuration
  healthCheck: {
    // Endpoints to monitor
    endpoints: [
      '/api/health',
      '/api/status',
    ],
    // Check interval in milliseconds
    interval: 30000,
    // Timeout in milliseconds
    timeout: 5000,
    // Required services
    services: [
      'database',
      'cache',
      'queue',
    ],
  },

  // Backup configuration
  backup: {
    // Backup schedule (cron expression)
    schedule: '0 0 * * *', // Daily at midnight
    // Retention period in days
    retention: 30,
    // Storage configuration
    storage: {
      provider: 'aws-s3',
      bucket: 'backups',
      path: 'database',
    },
  },

  // Monitoring configuration
  monitoring: {
    // Metrics to collect
    metrics: [
      'cpu',
      'memory',
      'disk',
      'network',
      'errors',
      'latency',
    ],
    // Alert thresholds
    alerts: {
      cpu: 80, // percentage
      memory: 85, // percentage
      disk: 90, // percentage
      errorRate: 1, // percentage
      latency: 1000, // milliseconds
    },
  },

  // Deployment scripts
  scripts: {
    // Pre-deployment checks
    preDeployment: [
      'npm run lint',
      'npm run test',
      'npm run build',
    ],
    // Deployment steps
    deployment: [
      'backup-database',
      'migrate-database',
      'deploy-application',
      'warm-cache',
    ],
    // Post-deployment verification
    postDeployment: [
      'health-check',
      'smoke-test',
      'performance-test',
    ],
    // Rollback procedures
    rollback: [
      'restore-database',
      'revert-application',
      'clear-cache',
    ],
  },
} as const;