import { createClient } from '@libsql/client';
import { QueryClient } from '@tanstack/react-query';

// Initialize database client
const db = createClient({
  url: process.env.DATABASE_URL || 'file:prompter.db'
});

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// API utilities
export const api = {
  async get(endpoint: string) {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': document.cookie.match(/csrf=([^;]+)/)?.[1] || '',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};