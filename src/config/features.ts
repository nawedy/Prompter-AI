export const featureConfig = {
  // Search system configuration
  search: {
    // Pagination
    pagination: {
      defaultSize: 20,
      maxSize: 100,
      // Cursor-based pagination
      useCursor: true,
    },
    // Sorting
    sorting: {
      defaultField: 'createdAt',
      defaultOrder: 'desc',
      allowedFields: ['title', 'createdAt', 'updatedAt', 'priority'],
    },
    // Filtering
    filtering: {
      maxFilters: 5,
      operators: ['eq', 'ne', 'gt', 'lt', 'contains'],
    },
  },

  // Batch operations
  batchOperations: {
    // Maximum items per batch
    maxBatchSize: 100,
    // Concurrent operations
    concurrency: 5,
    // Retry configuration
    retry: {
      attempts: 3,
      backoff: 'exponential',
    },
  },

  // Data export/import
  dataTransfer: {
    // Supported formats
    formats: ['json', 'csv', 'xlsx'],
    // Maximum file size in bytes
    maxSize: 10 * 1024 * 1024, // 10MB
    // Chunk size for streaming
    chunkSize: 1000,
    // Rate limiting
    rateLimit: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10,
    },
  },

  // Real-time collaboration
  realtime: {
    // WebSocket configuration
    websocket: {
      heartbeat: 30000,
      reconnect: {
        attempts: 5,
        delay: 1000,
      },
    },
    // Conflict resolution
    conflictResolution: {
      strategy: 'last-write-wins',
      mergeFields: ['content', 'metadata'],
    },
  },

  // Notifications
  notifications: {
    // Channels
    channels: ['email', 'push', 'in-app'],
    // Delivery preferences
    delivery: {
      email: {
        maxPerHour: 5,
        template: 'notification-email',
      },
      push: {
        maxPerHour: 10,
        priority: ['high', 'normal', 'low'],
      },
      inApp: {
        maxUnread: 100,
        retention: 30, // days
      },
    },
  },

  // Activity tracking
  activity: {
    // Event types to track
    events: [
      'create',
      'update',
      'delete',
      'share',
      'export',
      'import',
    ],
    // Storage configuration
    storage: {
      retention: 90, // days
      batchSize: 100,
      flushInterval: 5000, // ms
    },
  },
} as const;