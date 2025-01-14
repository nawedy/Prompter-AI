import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateUser: async (userData) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        // TODO: Replace with API call
        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
      }
    }),
    {
      name: 'user-store',
    }
  )
);