import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { jwtUtils } from '../utils/auth/jwt';
import { metrics } from '../utils/monitoring/metrics';

export function useAuth() {
  const navigate = useNavigate();
  const { login: setUser, logout: clearUser } = useUserStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      // TODO: Replace with API call
      const mockUser = {
        id: '1',
        email,
        name: 'Test User'
      };
      
      const token = jwtUtils.sign({ userId: mockUser.id });
      localStorage.setItem('token', token);
      
      setUser(mockUser);
      metrics.recordApiCall('auth.login.success', 0, 200);
      
      navigate('/dashboard');
      return mockUser;
    } catch (error) {
      metrics.recordApiCall('auth.login.error', 0, 401);
      throw error;
    }
  }, [navigate, setUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    clearUser();
    metrics.recordApiCall('auth.logout', 0, 200);
    navigate('/login');
  }, [navigate, clearUser]);

  const signup = useCallback(async (userData: { name: string; email: string; password: string }) => {
    try {
      // TODO: Replace with API call
      const mockUser = {
        id: '1',
        email: userData.email,
        name: userData.name,
        avatarUrl: '',
        apiKeys: {},
        settings: {
          theme: 'system',
          language: 'en',
          defaultMode: 'guide'
        }
      };

      const token = jwtUtils.sign({ userId: mockUser.id });
      localStorage.setItem('token', token);
      
      setUser(mockUser);
      metrics.recordApiCall('auth.signup.success', 0, 200);
      
      navigate('/dashboard');
      return mockUser;
    } catch (error) {
      metrics.recordApiCall('auth.signup.error', 0, 400);
      throw error;
    }
  }, [navigate, setUser]);

  return { login, logout, signup };
}