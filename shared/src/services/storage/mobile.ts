import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Prompt } from '../../types';
import type { StorageProvider } from './types';

export class MobileStorage implements StorageProvider {
  private readonly STORAGE_KEY = 'prompter_ai_prompts';
  private readonly LAST_SYNC_KEY = 'prompter_ai_last_sync';

  private async getStoredPrompts(): Promise<Prompt[]> {
    const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private async setStoredPrompts(prompts: Prompt[]): Promise<void> {
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(prompts));
  }

  async savePrompt(prompt: Prompt): Promise<void> {
    const prompts = await this.getStoredPrompts();
    prompts.push(prompt);
    await this.setStoredPrompts(prompts);
  }

  async getPrompts(limit?: number): Promise<Prompt[]> {
    const prompts = await this.getStoredPrompts();
    return limit ? prompts.slice(0, limit) : prompts;
  }

  async deletePrompt(id: string): Promise<void> {
    const prompts = await this.getStoredPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    await this.setStoredPrompts(filtered);
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<void> {
    const prompts = await this.getStoredPrompts();
    const index = prompts.findIndex(p => p.id === id);
    if (index !== -1) {
      prompts[index] = { ...prompts[index], ...updates };
      await this.setStoredPrompts(prompts);
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    const timestamp = await AsyncStorage.getItem(this.LAST_SYNC_KEY);
    return timestamp ? new Date(timestamp) : null;
  }

  async setLastSyncTime(date: Date): Promise<void> {
    await AsyncStorage.setItem(this.LAST_SYNC_KEY, date.toISOString());
  }
}
