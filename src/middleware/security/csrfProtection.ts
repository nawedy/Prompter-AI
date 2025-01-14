import { AuthenticationError } from '../../utils/errors';
import { appLogger } from '../../utils/logger';

export class CsrfProtection {
  private tokenLength = 32;
  private tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours

  async validate(req: Request): Promise<void> {
    const token = req.headers.get('x-csrf-token');
    const cookie = this.getTokenFromCookie(req);

    if (!token || !cookie || token !== cookie) {
      appLogger.warn('CSRF token validation failed', { token, cookie });
      throw new AuthenticationError('Invalid CSRF token');
    }

    if (!this.isTokenValid(cookie)) {
      appLogger.warn('CSRF token expired');
      throw new AuthenticationError('CSRF token expired');
    }
  }

  generateToken(): string {
    const buffer = new Uint8Array(this.tokenLength);
    crypto.getRandomValues(buffer);
    return Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  createCookie(token: string): string {
    const expires = new Date(Date.now() + this.tokenExpiry);
    return `csrf=${token}; Expires=${expires.toUTCString()}; Path=/; HttpOnly; SameSite=Strict`;
  }

  private getTokenFromCookie(req: Request): string | null {
    return req.headers.get('cookie')?.match(/csrf=([^;]+)/)?.[1] || null;
  }

  private isTokenValid(token: string): boolean {
    // Implement token validation logic (e.g., check expiry)
    return true;
  }
}