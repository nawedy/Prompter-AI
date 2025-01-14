import { useState, useCallback } from 'react';
import type { Folder } from '../types';

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);

  const addFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, []);

  const updateFolder = useCallback((id: string, data: Partial<Folder>) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === id
          ? { ...folder, ...data, updatedAt: new Date() }
          : folder
      )
    );
  }, []);

  const deleteFolder = useCallback((id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
  }, []);

  return {
    folders,
    addFolder,
    updateFolder,
    deleteFolder,
  };
}