# Quick Start Guide - AT Protocol Integration

This guide will help you get started with the AT Protocol integration in PrompterAI quickly.

## 5-Minute Setup

1. **Get Bluesky Credentials**
   ```bash
   # You'll need:
   - Bluesky account (sign up at bsky.app)
   - App Password (Settings → App Passwords)
   ```

2. **Set Environment Variables**
   ```env
   VITE_ATPROTO_SERVICE=https://bsky.social
   VITE_ATPROTO_APP_PASSWORD=your-app-password
   VITE_ATPROTO_IDENTIFIER=your-handle.bsky.social
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## First Prompt Creation

```typescript
import { PromptService } from '../services/atproto/promptService';

const promptService = new PromptService();
await promptService.createPrompt({
  text: "My first prompt",
  category: "general",
  tags: ["test", "first"],
  visibility: "public"
});
```

## Viewing Prompts

```typescript
const prompts = await promptService.getPrompts(10);
console.log(prompts);
```

## Next Steps

1. Read the full [AT Protocol Integration Guide](./AT_PROTOCOL_INTEGRATION.md)
2. Explore the [API Documentation](https://atproto.com/docs)
3. Join the [Developer Community](https://bsky.app)

## Need Help?

- Check the FAQ in the main documentation
- Submit an issue on GitHub
- Contact the development team
