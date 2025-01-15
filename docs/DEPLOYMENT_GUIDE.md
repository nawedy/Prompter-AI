# PrompterAI Deployment Guide

## Deployment Options

### 1. Web Application

#### Netlify Deployment
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production.environment]
  VITE_APP_ENV = "production"
```

#### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. Mobile Applications

#### React Native Setup
1. Install React Native CLI:
```bash
npm install -g react-native-cli
```

2. Create mobile wrapper:
```bash
npx react-native init PrompterAIMobile --template react-native-template-typescript
```

3. Share code between web and mobile:
```typescript
// src/platform/index.ts
export const isPlatform = {
  web: typeof window !== 'undefined',
  mobile: typeof window === 'undefined'
};
```

#### Progressive Web App (PWA)
1. Add PWA support:
```bash
npm install vite-plugin-pwa
```

2. Configure Vite for PWA:
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PrompterAI',
        short_name: 'PrompterAI',
        theme_color: '#ffffff',
        icons: [
          // Add icons here
        ]
      }
    })
  ]
})
```

## Architecture

### 1. Core Application
```
src/
├── components/     # Shared components
├── services/      # Business logic
│   ├── api/       # REST API services
│   └── atproto/   # AT Protocol services
└── platform/      # Platform-specific code
```

### 2. Data Storage Options

#### Local Storage
```typescript
// src/services/storage/local.ts
export class LocalStorage {
  async savePrompt(prompt: Prompt) {
    // Save to IndexedDB/localStorage
  }
}
```

#### AT Protocol Storage
```typescript
// src/services/storage/atproto.ts
export class ATProtoStorage {
  async savePrompt(prompt: Prompt) {
    // Save to Bluesky
  }
}
```

#### Hybrid Storage
```typescript
// src/services/storage/hybrid.ts
export class HybridStorage {
  constructor(
    private local: LocalStorage,
    private atproto: ATProtoStorage
  ) {}

  async savePrompt(prompt: Prompt) {
    // Save to both storages
    await Promise.all([
      this.local.savePrompt(prompt),
      this.atproto.savePrompt(prompt)
    ]);
  }
}
```

## Feature Availability Matrix

| Feature                | Web | Mobile | PWA | Bluesky Required |
|-----------------------|-----|--------|-----|------------------|
| Prompt Creation       | ✅  | ✅     | ✅  | ❌              |
| Local Storage         | ✅  | ✅     | ✅  | ❌              |
| Social Features       | ✅  | ✅     | ✅  | ✅              |
| Offline Support       | ✅  | ✅     | ✅  | ❌              |
| Push Notifications    | ✅  | ✅     | ✅  | ❌              |
| Data Sync            | ✅  | ✅     | ✅  | ✅              |

## Deployment Instructions

### 1. Web Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to Netlify
netlify deploy --prod
```

### 2. Mobile Deployment

#### iOS
```bash
# Build iOS app
cd ios
pod install
cd ..
react-native run-ios --configuration Release
```

#### Android
```bash
# Build Android app
cd android
./gradlew assembleRelease
```

### 3. PWA Deployment
```bash
# Build with PWA support
npm run build

# Test PWA locally
npm run preview
```

## Configuration

### 1. Environment Variables
```env
# Required for all deployments
VITE_API_URL=your-api-url

# Optional: AT Protocol integration
VITE_ATPROTO_SERVICE=https://bsky.social
VITE_ATPROTO_APP_PASSWORD=your-app-password
VITE_ATPROTO_IDENTIFIER=your-handle.bsky.social

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

### 2. Feature Flags
```typescript
// src/config/features.ts
export const features = {
  atproto: true,    // Enable/disable AT Protocol features
  offline: true,    // Enable/disable offline support
  sync: true        // Enable/disable data sync
};
```

## Testing

```bash
# Run web tests
npm test

# Run mobile tests
npm run test:mobile

# Run E2E tests
npm run test:e2e
```

## Monitoring

### 1. Web Analytics
```typescript
// src/services/analytics/web.ts
export class WebAnalytics {
  trackEvent(name: string, data: any) {
    // Implementation
  }
}
```

### 2. Mobile Analytics
```typescript
// src/services/analytics/mobile.ts
export class MobileAnalytics {
  trackEvent(name: string, data: any) {
    // Implementation
  }
}
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version
   - Clear cache: `npm clean-cache`
   - Rebuild: `npm rebuild`

2. **Mobile Build Issues**
   - Clean iOS build: `cd ios && xcodebuild clean`
   - Clean Android build: `cd android && ./gradlew clean`

3. **PWA Issues**
   - Check service worker registration
   - Verify manifest.json
   - Test with Lighthouse

## Security Considerations

1. **Web Security**
   - Enable HTTPS
   - Set up CSP headers
   - Implement CORS properly

2. **Mobile Security**
   - Enable app signing
   - Implement certificate pinning
   - Secure local storage

3. **Data Security**
   - Encrypt sensitive data
   - Implement proper authentication
   - Regular security audits

## Performance Optimization

1. **Web Performance**
   - Code splitting
   - Asset optimization
   - Caching strategies

2. **Mobile Performance**
   - Native optimizations
   - Memory management
   - Battery usage optimization

## Support

For deployment support:
1. Check our [GitHub Issues](https://github.com/your-repo/issues)
2. Join our [Discord Community](https://discord.gg/your-server)
3. Email: support@prompterai.com
