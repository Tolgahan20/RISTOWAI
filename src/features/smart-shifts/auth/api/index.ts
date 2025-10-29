import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  TokenResponse,
  SuccessResponse,
} from '../types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(api.auth.login, data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post(api.auth.register, data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<SuccessResponse> => {
  const response = await axiosInstance.post(api.auth.password.forgot, data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<SuccessResponse> => {
  const response = await axiosInstance.post(api.auth.password.reset, data);
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<SuccessResponse> => {
  const response = await axiosInstance.post(api.auth.password.verify, data);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await axiosInstance.post(api.auth.tokens.refresh, { refreshToken });
  return response.data;
};

export const revokeToken = async (refreshToken: string): Promise<SuccessResponse> => {
  const response = await axiosInstance.post(api.auth.tokens.revoke, { refreshToken });
  return response.data;
};
