import { useState } from 'react';
import { ScheduleMode, type GenerateScheduleRequest } from '../types';
import { getNextMonday, getNextSunday } from '../utils';

interface UseScheduleFormProps {
  venueId: string;
  onSubmit: (data: GenerateScheduleRequest) => void;
}

export const useScheduleForm = ({ venueId, onSubmit }: UseScheduleFormProps) => {
  const [formData, setFormData] = useState<GenerateScheduleRequest>({
    venueId,
    dateRange: {
      startDate: getNextMonday(),
      endDate: getNextSunday(),
    },
    mode: ScheduleMode.BALANCED,
    staffIds: [],
  });

  const updateDateRange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const updateMode = (mode: ScheduleMode) => {
    setFormData((prev) => ({
      ...prev,
      mode,
    }));
  };

  const updateStaffIds = (staffIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      staffIds,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    formData,
    updateDateRange,
    updateMode,
    updateStaffIds,
    handleSubmit,
  };
};

