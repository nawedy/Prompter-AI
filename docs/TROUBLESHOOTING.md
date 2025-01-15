# Troubleshooting Guide - AT Protocol Integration

This guide helps you resolve common issues when working with the AT Protocol integration.

## Common Issues and Solutions

### 1. Authentication Failures

#### Symptoms
- "Invalid credentials" error
- Unable to connect to Bluesky
- Session errors

#### Solutions
1. Verify environment variables:
   ```bash
   echo $VITE_ATPROTO_IDENTIFIER
   echo $VITE_ATPROTO_APP_PASSWORD
   ```

2. Check app password:
   - Generate a new app password
   - Ensure no whitespace in the password
   - Verify the password format

3. Verify handle format:
   - Should be `username.bsky.social`
   - Case sensitive
   - No spaces or special characters

### 2. Rate Limiting

#### Symptoms
- Too many requests error
- API calls failing intermittently
- Slow response times

#### Solutions
1. Implement caching:
   ```typescript
   const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
   let promptsCache = {
     data: null,
     timestamp: 0
   };

   async function getCachedPrompts() {
     if (Date.now() - promptsCache.timestamp < CACHE_DURATION) {
       return promptsCache.data;
     }
     // Fetch new data
   }
   ```

2. Add request throttling:
   ```typescript
   const queue = new RequestQueue({
     maxConcurrent: 3,
     interval: 1000
   });
   ```

### 3. Data Synchronization

#### Symptoms
- Inconsistent data
- Missing prompts
- Duplicate entries

#### Solutions
1. Implement retry logic:
   ```typescript
   async function withRetry(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
       }
     }
   }
   ```

2. Add error logging:
   ```typescript
   function logError(error, context) {
     console.error({
       timestamp: new Date().toISOString(),
       error: error.message,
       context,
       stack: error.stack
     });
   }
   ```

## Debugging Tools

### 1. Network Inspector
Use browser DevTools to inspect network requests:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter for requests to `bsky.social`

### 2. Logger Implementation
```typescript
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  static log(level, message, data?) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`, data || '');
  }
}
```

### 3. Health Check
```typescript
async function checkATProtoHealth() {
  try {
    const client = ATProtoClient.getInstance();
    await client.getAgent().getProfile({ actor: client.getAgent().session?.did });
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

## Performance Optimization

### 1. Request Batching
```typescript
class BatchProcessor {
  private queue: any[] = [];
  private timeout: NodeJS.Timeout | null = null;

  async add(item: any) {
    this.queue.push(item);
    if (!this.timeout) {
      this.timeout = setTimeout(() => this.process(), 100);
    }
  }

  private async process() {
    // Process queue items in batch
  }
}
```

### 2. Caching Strategy
```typescript
class Cache {
  private store = new Map();
  private ttl: number;

  constructor(ttl = 5 * 60 * 1000) {
    this.ttl = ttl;
  }

  set(key: string, value: any) {
    this.store.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }
}
```

## Error Recovery

### 1. Session Recovery
```typescript
async function recoverSession() {
  const client = ATProtoClient.getInstance();
  try {
    await client.getAgent().resumeSession();
  } catch {
    // Attempt re-login
    await client.login();
  }
}
```

### 2. Data Reconciliation
```typescript
async function reconcilePrompts() {
  const local = await getLocalPrompts();
  const remote = await getRemotePrompts();
  
  // Find differences
  const toSync = findDifferences(local, remote);
  
  // Sync changes
  await syncChanges(toSync);
}
```

## Monitoring and Alerts

### 1. Health Metrics
```typescript
interface HealthMetrics {
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastSync: Date;
}

class HealthMonitor {
  private metrics: HealthMetrics;

  updateMetrics(metric: keyof HealthMetrics, value: any) {
    this.metrics[metric] = value;
    this.checkThresholds();
  }

  private checkThresholds() {
    // Alert if thresholds exceeded
  }
}
```

### 2. Alert System
```typescript
enum AlertLevel {
  INFO,
  WARNING,
  CRITICAL
}

class AlertSystem {
  alert(level: AlertLevel, message: string) {
    // Send alert via preferred channel
  }
}
```

## Need More Help?

1. Check the main [AT_PROTOCOL_INTEGRATION.md](./AT_PROTOCOL_INTEGRATION.md) documentation
2. Join our developer Discord channel
3. Submit a GitHub issue
4. Contact support at support@prompterai.com
