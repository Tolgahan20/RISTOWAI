import { useState } from 'react';
import { useValidateExport, useCreateExport } from './useExports';
import { useNotificationStore } from '../../common/stores/notification';
import { EXPORT_MESSAGES } from '../../common/constants/messages';
import type { CreateExportRequest, ValidationResult } from '../types';

interface UseExportFormProps {
  venueId: string;
  onSuccess?: () => void;
}

interface ExportFormData {
  startDate: string;
  endDate: string;
  notes: string;
}

export const useExportForm = ({ venueId, onSuccess }: UseExportFormProps) => {
  const [formData, setFormData] = useState<ExportFormData>({
    startDate: '',
    endDate: '',
    notes: '',
  });

  const showNotification = useNotificationStore((state) => state.showNotification);
  const validateMutation = useValidateExport();
  const createMutation = useCreateExport();

  const updateField = <K extends keyof ExportFormData>(
    field: K,
    value: ExportFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) <= new Date(formData.endDate);

  const handleValidate = async () => {
    if (!isFormValid) {
      return;
    }

    const request: CreateExportRequest = {
      venueId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes || undefined,
    };

    try {
      await validateMutation.mutateAsync(request);
      showNotification({ 
        message: EXPORT_MESSAGES.validate.success, 
        type: 'success' 
      });
    } catch {
      showNotification({ 
        message: EXPORT_MESSAGES.validate.error, 
        type: 'error' 
      });
    }
  };

  const handleCreate = async () => {
    if (!isFormValid) {
      return;
    }

    const request: CreateExportRequest = {
      venueId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes || undefined,
    };

    try {
      await createMutation.mutateAsync(request);

      showNotification({ 
        message: EXPORT_MESSAGES.create.success, 
        type: 'success' 
      });

      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        notes: '',
      });
      validateMutation.reset();

      onSuccess?.();
    } catch {
      showNotification({ 
        message: EXPORT_MESSAGES.create.error, 
        type: 'error' 
      });
    }
  };

  const validation: ValidationResult | undefined = validateMutation.data;

  return {
    formData,
    updateField,
    isFormValid,
    validation,
    handleValidate,
    handleCreate,
    isValidating: validateMutation.isPending,
    isCreating: createMutation.isPending,
    validationError: validateMutation.error,
    createError: createMutation.error,
  };
};

