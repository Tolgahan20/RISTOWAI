import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { VALIDATION_MESSAGES } from '../../common/constants/messages';
import type { LoginRequest } from '../types';

export type LoginFormData = LoginRequest;

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const useLoginForm = () => {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const markFieldTouched = useCallback((field: keyof LoginFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: LoginFormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL.INVALID;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = VALIDATION_MESSAGES.REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit login
    await login.mutateAsync(formData);
  }, [formData, validateForm, login]);

  const getFieldError = useCallback((field: keyof LoginFormData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  }, [touched, errors]);

  return {
    formData,
    errors,
    touched,
    isLoading: login.isPending,
    isSuccess: login.isSuccess,
    updateField,
    markFieldTouched,
    handleSubmit,
    getFieldError,
  };
};

