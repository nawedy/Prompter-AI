import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prompt, Folder } from '../types';

interface PromptStore {
  prompts: Prompt[];
  folders: Folder[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (id: string, data: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  addFolder: (name: string, parentId?: string) => void;
  updateFolder: (id: string, data: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set) => ({
      prompts: [],
      folders: [],
      addPrompt: (promptData) => set((state) => ({
        prompts: [...state.prompts, {
          ...promptData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      })),
      updatePrompt: (id, data) => set((state) => ({
        prompts: state.prompts.map((prompt) =>
          prompt.id === id
            ? { ...prompt, ...data, updatedAt: new Date() }
            : prompt
        ),
      })),
      deletePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter((prompt) => prompt.id !== id),
      })),
      addFolder: (name, parentId) => set((state) => ({
        folders: [...state.folders, {
          id: crypto.randomUUID(),
          name,
          parentId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      })),
      updateFolder: (id, data) => set((state) => ({
        folders: state.folders.map((folder) =>
          folder.id === id
            ? { ...folder, ...data, updatedAt: new Date() }
            : folder
        ),
      })),
      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== id),
      })),
    }),
    {
      name: 'prompt-store',
    }
  )
);