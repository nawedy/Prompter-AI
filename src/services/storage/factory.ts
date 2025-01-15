import type { StorageProvider } from './types';
import { LocalStorage } from './local';
import { HybridStorage } from './hybrid';

export enum StorageType {
  LOCAL = 'local',
  HYBRID = 'hybrid'
}

export class StorageFactory {
  private static instance: StorageFactory;
  private currentStorage: StorageProvider;

  private constructor() {
    // Default to local storage
    this.currentStorage = new LocalStorage();
  }

  public static getInstance(): StorageFactory {
    if (!StorageFactory.instance) {
      StorageFactory.instance = new StorageFactory();
    }
    return StorageFactory.instance;
  }

  public initializeStorage(type: StorageType): void {
    switch (type) {
      case StorageType.LOCAL:
        this.currentStorage = new LocalStorage();
        break;
      case StorageType.HYBRID:
        this.currentStorage = new HybridStorage();
        break;
      default:
        throw new Error(`Unknown storage type: ${type}`);
    }
  }

  public getStorage(): StorageProvider {
    return this.currentStorage;
  }
}

// Create a convenience function to get the current storage
export function useStorage(): StorageProvider {
  return StorageFactory.getInstance().getStorage();
}
