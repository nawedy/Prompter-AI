import { useState, useCallback } from 'react';
import type { User } from '../types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) {
        return {
          id: crypto.randomUUID(),
          name: userData.name || '',
          email: userData.email || '',
          avatarUrl: userData.avatarUrl || '',
          apiKeys: userData.apiKeys || {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return {
        ...prev,
        ...userData,
        updatedAt: new Date(),
      };
    });
  }, []);

  return {
    user,
    updateUser,
  };
}