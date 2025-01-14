import { ValidationError } from '../../utils/errors';

export const csrfProtection = {
  generateToken: () => {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    return Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  validateToken: (token: string, storedToken: string) => {
    if (!token || !storedToken || token !== storedToken) {
      throw new ValidationError('Invalid CSRF token', new Error('CSRF validation failed'));
    }
  }
};