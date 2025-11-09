import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { VALIDATION_MESSAGES } from '../../smart-shifts/common/constants/messages';
import type { RegisterRequest } from '../types';

export interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const useRegisterForm = () => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = useCallback((field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const markFieldTouched = useCallback((field: keyof RegisterFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: RegisterFormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = VALIDATION_MESSAGES.REQUIRED;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = VALIDATION_MESSAGES.REQUIRED;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL.INVALID;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = VALIDATION_MESSAGES.REQUIRED;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD.MATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit registration
    const { confirmPassword, ...registerData } = formData;
    await register.mutateAsync(registerData);
  }, [formData, validateForm, register]);

  const getFieldError = useCallback((field: keyof RegisterFormData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  }, [touched, errors]);

  return {
    formData,
    errors,
    touched,
    isLoading: register.isPending,
    isSuccess: register.isSuccess,
    updateField,
    markFieldTouched,
    handleSubmit,
    getFieldError,
  };
};

