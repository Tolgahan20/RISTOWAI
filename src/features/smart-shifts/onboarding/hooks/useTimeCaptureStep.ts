import { useState } from 'react';
import { TimeCaptureMethod, type TimeCaptureData } from '../types';

interface UseTimeCaptureStepProps {
  onSave: (data: TimeCaptureData) => Promise<void>;
  initialData?: TimeCaptureData | null;
}

const INITIAL_FORM_STATE: TimeCaptureData = {
  method: TimeCaptureMethod.AUTO, // AUTO = Staff clock in/out via QR code/app
  requirePhotoVerification: false,
  allowEarlyClockIn: true,
  earlyClockInMinutes: 15,
  allowLateClockOut: true,
  lateClockOutMinutes: 30,
  autoBreakDeduction: false,
  breakDurationMinutes: 30,
};

export const useTimeCaptureStep = ({
  onSave,
  initialData,
}: UseTimeCaptureStepProps) => {
  const [formData, setFormData] = useState<TimeCaptureData>({
    ...INITIAL_FORM_STATE,
    ...initialData,
  });

  const handleToggle = (field: keyof TimeCaptureData) => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleNumberChange = (field: keyof TimeCaptureData, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return {
    formData,
    handleToggle,
    handleNumberChange,
    handleSubmit,
  };
};

