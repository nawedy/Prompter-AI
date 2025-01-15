import type { StorageProvider } from './types';
import { LocalStorage } from './local';
import { MobileStorage } from './mobile';
import { HybridStorage } from './hybrid';
import { Platform } from '../../utils/platform';

export enum StorageType {
  LOCAL = 'local',
  MOBILE = 'mobile',
  HYBRID = 'hybrid'
}

export class StorageFactory {
  private static instance: StorageFactory;
  private currentStorage: StorageProvider;

  private constructor() {
    // Default to appropriate storage based on platform
    if (Platform.isNative) {
      this.currentStorage = new MobileStorage();
    } else {
      this.currentStorage = new LocalStorage();
    }
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
        if (Platform.isNative) {
          throw new Error('LocalStorage is not available on mobile platforms');
        }
        this.currentStorage = new LocalStorage();
        break;
      case StorageType.MOBILE:
        if (!Platform.isNative) {
          throw new Error('MobileStorage is only available on mobile platforms');
        }
        this.currentStorage = new MobileStorage();
        break;
      case StorageType.HYBRID:
        if (Platform.isNative) {
          this.currentStorage = new HybridStorage(new MobileStorage());
        } else {
          this.currentStorage = new HybridStorage(new LocalStorage());
        }
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
