import jwt from 'jsonwebtoken';
import { ValidationError } from '../errors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key-min-32-chars-long';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export const jwtUtils = {
  sign(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  },

  verify<T>(token: string): T {
    try {
      return jwt.verify(token, JWT_SECRET) as T;
    } catch (error) {
      throw new ValidationError('Invalid token', error);
    }
  }
};