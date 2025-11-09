import axios from 'axios';
import { api } from '../../smart-shifts/common/constants/api';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenService = {
  getAccessToken: (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  },

  getRefreshToken: (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  removeTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenService.getAccessToken();
  },

  revokeToken: async (refreshToken: string): Promise<void> => {
    try {
      await axios.post(api.auth.tokens.revoke, { refreshToken });
    } catch (error) {
      console.error('Failed to revoke token:', error);
      // Even if revoke fails, we should still remove local tokens
    }
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenService.getRefreshToken();
    if (refreshToken) {
      await tokenService.revokeToken(refreshToken);
    }
    tokenService.removeTokens();
  },
};
