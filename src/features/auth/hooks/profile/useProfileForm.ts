import { useState, useEffect } from 'react';
import type { UserProfile } from '@/types/auth';

export const useProfileForm = (initialProfile?: UserProfile) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        firstName: initialProfile.firstName || '',
        lastName: initialProfile.lastName || '',
      });
    }
  }, [initialProfile]);

  const updateField = (field: 'firstName' | 'lastName', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    if (initialProfile) {
      setFormData({
        firstName: initialProfile.firstName || '',
        lastName: initialProfile.lastName || '',
      });
    }
  };

  const hasChanges = () => {
    if (!initialProfile) return false;
    return (
      formData.firstName !== (initialProfile.firstName || '') ||
      formData.lastName !== (initialProfile.lastName || '')
    );
  };

  return {
    formData,
    updateField,
    resetForm,
    hasChanges,
  };
};

export const usePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateField = (
    field: 'currentPassword' | 'newPassword' | 'confirmPassword',
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password attuale richiesta';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nuova password richiesta';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'La password deve avere almeno 8 caratteri';
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
  };
};

export const useEmailForm = (initialEmail?: string) => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    currentPassword: '',
  });

  useEffect(() => {
    if (initialEmail) {
      setFormData((prev) => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const updateField = (field: 'email' | 'currentPassword', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      currentPassword: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email richiesta';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password richiesta per conferma';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const resetForm = () => {
    setFormData({
      email: initialEmail || '',
      currentPassword: '',
    });
    setErrors({
      email: '',
      currentPassword: '',
    });
  };

  const hasChanges = () => {
    return formData.email !== (initialEmail || '');
  };

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
    hasChanges,
  };
};

