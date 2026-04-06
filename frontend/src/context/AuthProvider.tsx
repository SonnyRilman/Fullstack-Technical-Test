import React, { useState, useCallback } from 'react';
import type { AuthState, TokenResponse } from '../types';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user_info');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { token, username: user.username, fullName: user.full_name, isAuthenticated: true };
    }
    return { token: null, username: null, fullName: null, isAuthenticated: false };
  });

  const login = useCallback((tokenData: TokenResponse) => {
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem('user_info', JSON.stringify({
      username: tokenData.username,
      full_name: tokenData.full_name,
    }));
    setAuth({
      token: tokenData.access_token,
      username: tokenData.username,
      fullName: tokenData.full_name,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setAuth({ token: null, username: null, fullName: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
