import { useState, useCallback } from 'react';
import type { Prompt } from '../types';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const addPrompt = useCallback((promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPrompts((prev) => [...prev, newPrompt]);
  }, []);

  const updatePrompt = useCallback((id: string, promptData: Partial<Prompt>) => {
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? { ...prompt, ...promptData, updatedAt: new Date() }
          : prompt
      )
    );
  }, []);

  const deletePrompt = useCallback((id: string) => {
    setPrompts((prev) => prev.filter((prompt) => prompt.id !== id));
  }, []);

  return {
    prompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
  };
}