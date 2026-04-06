import { createContext } from 'react';
import type { AuthState, TokenResponse } from '../types';

export interface AuthContextType extends AuthState {
  login: (tokenData: TokenResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
