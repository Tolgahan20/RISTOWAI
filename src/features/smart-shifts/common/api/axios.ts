import axios from 'axios';
import { tokenService } from '../../auth/services/token.service';
import { api } from '../constants/api';

export const axiosInstance = axios.create({
  baseURL: api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(api.auth.tokens.refresh, { refreshToken });
        tokenService.setTokens(response.data.accessToken, response.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        tokenService.removeTokens();
        // Handle refresh token failure (redirect to login, etc.)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
