import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as authApi from '../api';
import { useNotification } from '../../smart-shifts/common/hooks/useNotification';
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from '../../smart-shifts/common/constants/messages';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface TouchedFields {
  password: boolean;
  confirm: boolean;
}

export const useResetPassword = (token: string | null) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [touched, setTouched] = useState<TouchedFields>({ password: false, confirm: false });
  const { success, error } = useNotification();

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string; newPassword: string }) => authApi.resetPassword(data),
    onSuccess: () => {
      success(AUTH_MESSAGES.PASSWORD.RESET.SUCCESS);
      setTimeout(() => {
        void router.push('/login' as any);
      }, 2000);
    },
    onError: (err: unknown) => {
      const message = (err as AxiosError<{ message: string }>)?.response?.data?.message || AUTH_MESSAGES.PASSWORD.RESET.ERROR;
      error(message);
    },
  });

  const validatePassword = (pass: string): string | null => {
    if (!pass) {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    if (pass.length < 8) {
      return VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH;
    }
    return null;
  };

  const updatePassword = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    if (passwordError) {
      setPasswordError('');
    }
    if (formData.confirmPassword && value !== formData.confirmPassword) {
      setConfirmError(VALIDATION_MESSAGES.PASSWORD.MATCH);
    } else if (confirmError) {
      setConfirmError('');
    }
  }, [passwordError, confirmError, formData.confirmPassword]);

  const updateConfirmPassword = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, confirmPassword: value }));
    if (value !== formData.password) {
      setConfirmError(VALIDATION_MESSAGES.PASSWORD.MATCH);
    } else {
      setConfirmError('');
    }
  }, [formData.password]);

  const markPasswordTouched = useCallback(() => {
    setTouched(prev => ({ ...prev, password: true }));
  }, []);

  const markConfirmTouched = useCallback(() => {
    setTouched(prev => ({ ...prev, confirm: true }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    if (!token) {
      error(AUTH_MESSAGES.PASSWORD.RESET.INVALID_TOKEN);
      return;
    }

    const passError = validatePassword(formData.password);
    if (passError) {
      setPasswordError(passError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmError(VALIDATION_MESSAGES.PASSWORD.MATCH);
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword: formData.password });
  }, [token, formData, resetPasswordMutation, error]);

  const getPasswordError = useCallback((): string | undefined => {
    return touched.password ? passwordError : undefined;
  }, [touched.password, passwordError]);

  const getConfirmError = useCallback((): string | undefined => {
    return touched.confirm ? confirmError : undefined;
  }, [touched.confirm, confirmError]);

  return {
    formData,
    updatePassword,
    updateConfirmPassword,
    markPasswordTouched,
    markConfirmTouched,
    handleSubmit,
    getPasswordError,
    getConfirmError,
    isLoading: resetPasswordMutation.isPending,
    isSuccess: resetPasswordMutation.isSuccess,
  };
};

