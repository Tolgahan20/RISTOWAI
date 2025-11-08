import { useState } from 'react';

export const useAnomaliesSection = (onResolve: (timeEventId: string, notes: string, approvedHours?: number) => void) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [approvedHours, setApprovedHours] = useState('');

  const handleResolve = (timeEventId: string) => {
    if (!resolutionNotes.trim()) return;
    
    onResolve(
      timeEventId,
      resolutionNotes,
      approvedHours ? parseFloat(approvedHours) : undefined,
    );
    
    resetForm();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setExpandedId(null);
    setResolutionNotes('');
    setApprovedHours('');
  };

  return {
    expandedId,
    resolutionNotes,
    approvedHours,
    setResolutionNotes,
    setApprovedHours,
    handleResolve,
    toggleExpand,
  };
};

