import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as authApi from '../api';
import { useNotification } from '../../common/hooks/useNotification';
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from '../../common/constants/messages';

interface ForgotPasswordFormData {
  email: string;
}

export const useForgotPassword = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const { success, error } = useNotification();

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: { email: string }) => authApi.forgotPassword(data),
    onSuccess: () => {
      success(AUTH_MESSAGES.PASSWORD.FORGOT.SUCCESS);
    },
    onError: (err: unknown) => {
      const message = (err as AxiosError<{ message: string }>)?.response?.data?.message || AUTH_MESSAGES.PASSWORD.FORGOT.ERROR;
      error(message);
    },
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateEmail = useCallback((value: string) => {
    setFormData({ email: value });
    if (emailError) {
      setEmailError('');
    }
  }, [emailError]);

  const markTouched = useCallback(() => {
    setTouched(true);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!formData.email.trim()) {
      setEmailError(VALIDATION_MESSAGES.REQUIRED);
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError(VALIDATION_MESSAGES.EMAIL.INVALID);
      return;
    }

    forgotPasswordMutation.mutate({ email: formData.email });
  }, [formData.email, forgotPasswordMutation]);

  const getEmailError = useCallback((): string | undefined => {
    return touched ? emailError : undefined;
  }, [touched, emailError]);

  return {
    formData,
    updateEmail,
    markTouched,
    handleSubmit,
    getEmailError,
    isLoading: forgotPasswordMutation.isPending,
    isSuccess: forgotPasswordMutation.isSuccess,
    resend: () => forgotPasswordMutation.mutate({ email: formData.email }),
  };
};

