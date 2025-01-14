import { appLogger } from '../logger';
import { metrics } from '../monitoring/metrics';

interface Secret {
  value: string;
  createdAt: number;
  expiresAt: number;
}

export class SecretRotation {
  private secrets: Map<string, Secret[]> = new Map();
  private readonly maxSecrets: number = 2; // Keep current + previous
  private readonly defaultTTL: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.startCleanupInterval();
  }

  rotateSecret(name: string, newValue: string, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    const secret: Secret = {
      value: newValue,
      createdAt: now,
      expiresAt: now + ttl
    };

    const existingSecrets = this.secrets.get(name) || [];
    const updatedSecrets = [secret, ...existingSecrets].slice(0, this.maxSecrets);
    
    this.secrets.set(name, updatedSecrets);
    
    appLogger.info(`Secret rotated: ${name}`, {
      expiresAt: new Date(secret.expiresAt).toISOString()
    });
    
    metrics.recordApiCall('secret_rotation', 0, 200);
  }

  validateSecret(name: string, value: string): boolean {
    const secrets = this.secrets.get(name) || [];
    const now = Date.now();
    
    return secrets.some(secret => 
      secret.value === value && secret.expiresAt > now
    );
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      
      for (const [name, secrets] of this.secrets.entries()) {
        const validSecrets = secrets.filter(s => s.expiresAt > now);
        
        if (validSecrets.length !== secrets.length) {
          this.secrets.set(name, validSecrets);
          appLogger.info(`Expired secrets cleaned for: ${name}`);
        }
      }
    }, 60 * 60 * 1000); // Check every hour
  }
}

export const secretRotation = new SecretRotation();