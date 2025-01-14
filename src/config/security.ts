export const securityConfig = {
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    maxConcurrent: 10,
    headers: true,
  },

  // CSRF protection
  csrf: {
    tokenLength: 32,
    cookieName: 'csrf',
    headerName: 'x-csrf-token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },

  // Security headers
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.supabase.com'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    frameOptions: 'DENY',
    noSniff: true,
    xssProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },

  // Input validation
  validation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    sanitization: {
      allowedTags: [],
      allowedAttributes: {},
    },
  },

  // Monitoring
  monitoring: {
    metrics: {
      interval: 5000, // 5 seconds
      retention: 24 * 60 * 60 * 1000, // 24 hours
    },
    alerts: {
      rateLimit: {
        threshold: 100, // alerts if more than 100 blocked requests
        window: 5 * 60 * 1000, // 5 minutes
      },
      csrf: {
        threshold: 50, // alerts if more than 50 invalid tokens
        window: 5 * 60 * 1000, // 5 minutes
      },
      validation: {
        threshold: 100, // alerts if more than 100 failed validations
        window: 5 * 60 * 1000, // 5 minutes
      },
    },
  },
} as const;