import { useState, useCallback, FormEvent } from 'react';
import { VenueType, type VenueInfoData } from '../types';
import { VALIDATION_MESSAGES } from '../../common/constants/messages';

interface FormErrors {
  name?: string;
  address?: string;
  type?: string;
  timezone?: string;
}

interface TouchedFields {
  name: boolean;
  address: boolean;
  type: boolean;
  timezone: boolean;
}

interface UseVenueInfoStepProps {
  onSave: (data: VenueInfoData) => Promise<void>;
  initialData?: VenueInfoData | null;
}

export const useVenueInfoStep = ({ onSave, initialData }: UseVenueInfoStepProps) => {
  const [formData, setFormData] = useState<VenueInfoData>({
    name: initialData?.name || '',
    type: initialData?.type || VenueType.RESTAURANT,
    timezone: initialData?.timezone || '',
    address: initialData?.address || '',
    taxId: initialData?.taxId || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    address: false,
    type: false,
    timezone: false,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user types
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!formData.address?.trim()) {
      newErrors.address = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!formData.type) {
      newErrors.type = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!formData.timezone) {
      newErrors.timezone = VALIDATION_MESSAGES.REQUIRED;
    }

    setErrors(newErrors);
    setTouched({ name: true, address: true, type: true, timezone: true });

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (validate()) {
        await onSave(formData);
      }
    },
    [formData, onSave, validate],
  );

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

