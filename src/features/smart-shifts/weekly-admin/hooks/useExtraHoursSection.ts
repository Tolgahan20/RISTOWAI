import { useState } from 'react';
import { ExtraHoursDisposition } from '../types';
import type { ExtraHoursItem } from '../types';

export const useExtraHoursSection = (
  onApprove: (staffId: string, weekStartDate: string, extraHours: number, disposition: ExtraHoursDisposition, notes?: string) => void
) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<ExtraHoursDisposition>(ExtraHoursDisposition.PAID);
  const [notes, setNotes] = useState('');

  const handleApprove = (item: ExtraHoursItem) => {
    onApprove(item.staffId, item.weekStartDate, item.extraHours, disposition, notes || undefined);
    resetForm();
  };

  const toggleExpand = (staffId: string) => {
    setExpandedId(expandedId === staffId ? null : staffId);
    if (expandedId !== staffId) {
      resetForm();
    }
  };

  const resetForm = () => {
    setExpandedId(null);
    setDisposition(ExtraHoursDisposition.PAID);
    setNotes('');
  };

  return {
    expandedId,
    disposition,
    notes,
    setDisposition,
    setNotes,
    handleApprove,
    toggleExpand,
  };
};

