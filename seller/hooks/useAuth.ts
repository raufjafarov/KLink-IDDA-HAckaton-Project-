import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useUser } from './useUser';

export const checkAuth = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { clearCurrentUser } = useUser();

  const login = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    clearCurrentUser(); // Only clear the active user session
    navigate('/login');
  }, [navigate, clearCurrentUser]);

  return { login, logout };
};
