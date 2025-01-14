import { api } from './api';
import { User } from '../types';

export const auth = {
  async login(email: string, password: string): Promise<User> {
    const response = await api.post('auth/login', { email, password });
    localStorage.setItem('token', response.token);
    return response.user;
  },

  async signup(userData: Partial<User>): Promise<User> {
    const response = await api.post('auth/signup', userData);
    localStorage.setItem('token', response.token);
    return response.user;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};