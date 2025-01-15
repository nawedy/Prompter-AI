import type { Prompt } from '../../types';
import type { StorageProvider, SyncStrategy } from './types';
import { LocalStorage } from './local';
import { PromptService } from '../atproto/promptService';

export class HybridStorage implements StorageProvider, SyncStrategy {
  constructor(
    private local: LocalStorage = new LocalStorage(),
    private atproto: PromptService = new PromptService()
  ) {}

  async savePrompt(prompt: Prompt): Promise<void> {
    // Save locally first
    await this.local.savePrompt(prompt);

    try {
      // Then try to save to AT Protocol
      await this.atproto.createPrompt({
        text: prompt.title,
        category: prompt.category,
        tags: prompt.tags || [],
        visibility: 'public',
        createdAt: prompt.createdAt.toISOString(),
        updatedAt: prompt.updatedAt.toISOString(),
        record: {
          text: prompt.content,
          langs: ['en'],
          $type: 'app.bsky.feed.post'
        }
      });
    } catch (error) {
      console.error('Failed to save to AT Protocol:', error);
      // Continue anyway as we have local copy
    }
  }

  async getPrompts(limit?: number): Promise<Prompt[]> {
    try {
      // Try to sync first
      await this.sync();
    } catch (error) {
      console.error('Sync failed:', error);
    }

    // Return local prompts
    return this.local.getPrompts(limit);
  }

  async deletePrompt(id: string): Promise<void> {
    await this.local.deletePrompt(id);
    try {
      // Also try to delete from AT Protocol
      await this.atproto.deletePrompt(id);
    } catch (error) {
      console.error('Failed to delete from AT Protocol:', error);
    }
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<void> {
    await this.local.updatePrompt(id, updates);
    try {
      // Create new version in AT Protocol
      const prompt = (await this.local.getPrompts()).find(p => p.id === id);
      if (prompt) {
        await this.atproto.createPrompt({
          text: prompt.title,
          category: prompt.category,
          tags: prompt.tags || [],
          visibility: 'public',
          createdAt: prompt.createdAt.toISOString(),
          updatedAt: new Date().toISOString(),
          record: {
            text: prompt.content,
            langs: ['en'],
            $type: 'app.bsky.feed.post'
          }
        });
      }
    } catch (error) {
      console.error('Failed to update in AT Protocol:', error);
    }
  }

  async sync(): Promise<void> {
    try {
      // Get last sync time
      const lastSync = await this.local.getLastSyncTime();

      // Get prompts from AT Protocol
      const atProtoPrompts = await this.atproto.getPrompts();

      // Convert AT Protocol prompts to local format
      const convertedPrompts: Prompt[] = atProtoPrompts.map(ap => ({
        id: ap.record.$type + ap.createdAt,
        title: ap.text,
        content: ap.record.text,
        category: ap.category,
        tags: ap.tags,
        toolType: 'TEXT_COMPLETION',
        createdAt: new Date(ap.createdAt),
        updatedAt: new Date(ap.updatedAt)
      }));

      // Get local prompts
      const localPrompts = await this.local.getPrompts();

      // Merge prompts, preferring newer versions
      const mergedPrompts = this.mergePrompts(localPrompts, convertedPrompts);

      // Update local storage
      await this.local.setStoredPrompts(mergedPrompts);

      // Update sync time
      await this.local.setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  private mergePrompts(local: Prompt[], remote: Prompt[]): Prompt[] {
    const merged = new Map<string, Prompt>();

    // Add all local prompts
    local.forEach(prompt => merged.set(prompt.id, prompt));

    // Add/update remote prompts if they're newer
    remote.forEach(prompt => {
      const existing = merged.get(prompt.id);
      if (!existing || existing.updatedAt < prompt.updatedAt) {
        merged.set(prompt.id, prompt);
      }
    });

    return Array.from(merged.values());
  }

  async getLastSyncTime(): Promise<Date | null> {
    return this.local.getLastSyncTime();
  }
}
