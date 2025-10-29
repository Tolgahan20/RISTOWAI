import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from '../api';
import { useErrorHandler } from '../../common/hooks/useErrorHandler';
import { useNotification } from '../../common/hooks/useNotification';
import { AUTH_MESSAGES } from '../../common/constants/messages';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler({ showNotification: true });
  const notification = useNotification();

  const login = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      notification.success(AUTH_MESSAGES.LOGIN.SUCCESS);
    },
    onError: handleError,
  });

  const register = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      notification.success(AUTH_MESSAGES.REGISTER.SUCCESS);
    },
    onError: handleError,
  });

  const forgotPassword = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => {
      notification.success(AUTH_MESSAGES.PASSWORD.FORGOT.SUCCESS);
    },
    onError: handleError,
  });

  const resetPassword = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      notification.success(AUTH_MESSAGES.PASSWORD.RESET.SUCCESS);
    },
    onError: handleError,
  });

  const verifyEmail = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: () => {
      notification.success(AUTH_MESSAGES.EMAIL.VERIFY.SUCCESS);
    },
    onError: handleError,
  });

  const refreshToken = useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.accessToken);
      queryClient.setQueryData(['refreshToken'], data.refreshToken);
    },
    onError: handleError,
  });

  const revokeToken = useMutation({
    mutationFn: (refreshToken: string) => authApi.revokeToken(refreshToken),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      notification.success(AUTH_MESSAGES.TOKEN.REVOKE_SUCCESS);
    },
    onError: handleError,
  });

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken,
    revokeToken,
  };
};