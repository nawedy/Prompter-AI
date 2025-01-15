import type { Prompt } from '../../types';
import type { ATProtoPrompt } from '../atproto/types';

export interface StorageProvider {
  savePrompt(prompt: Prompt): Promise<void>;
  getPrompts(limit?: number): Promise<Prompt[]>;
  deletePrompt(id: string): Promise<void>;
  updatePrompt(id: string, prompt: Partial<Prompt>): Promise<void>;
}

export interface SyncStrategy {
  sync(): Promise<void>;
  getLastSyncTime(): Promise<Date | null>;
}
