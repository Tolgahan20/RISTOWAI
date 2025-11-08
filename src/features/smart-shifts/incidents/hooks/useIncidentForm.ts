import { useState, useMemo } from 'react';
import { Incident, CreateIncidentRequest, IncidentType, IncidentSeverity } from '../types';

interface UseIncidentFormProps {
  venueId: string;
  incident?: Incident | null;
  onSubmit: (data: CreateIncidentRequest) => void;
}

// Helper function to get initial form data
const getInitialFormData = (venueId: string, incident?: Incident | null): CreateIncidentRequest => {
  if (incident) {
    return {
      venueId: incident.venueId,
      staffId: incident.staff?.id || incident.staffId || '',
      shiftId: incident.shift?.id || incident.shiftId || '',
      incidentDate: new Date(incident.incidentDate).toISOString().split('T')[0],
      incidentType: incident.incidentType,
      severity: incident.severity,
      description: incident.description,
      reportedBy: incident.reportedBy || '',
    };
  }
  
  return {
    venueId,
    staffId: '',
    shiftId: '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentType: IncidentType.ABSENCE_NO_NOTICE,
    severity: IncidentSeverity.MEDIUM,
    description: '',
    reportedBy: '',
  };
};

export const useIncidentForm = ({ venueId, incident, onSubmit }: UseIncidentFormProps) => {
  // Initialize form data based on incident prop
  const initialData = useMemo(() => getInitialFormData(venueId, incident), [venueId, incident]);
  
  const [formData, setFormData] = useState<CreateIncidentRequest>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

 
  const updateField = (field: keyof CreateIncidentRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.staffId.trim()) {
      newErrors.staffId = 'Staff è obbligatorio';
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Data incidente è obbligatoria';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrizione è obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanedData: CreateIncidentRequest = {
      venueId: formData.venueId,
      staffId: formData.staffId.trim(),
      incidentDate: formData.incidentDate,
      incidentType: formData.incidentType,
      severity: formData.severity,
      description: formData.description.trim(),
    };

    if (formData.shiftId?.trim()) {
      cleanedData.shiftId = formData.shiftId.trim();
    }

    if (formData.reportedBy?.trim()) {
      cleanedData.reportedBy = formData.reportedBy.trim();
    }

    onSubmit(cleanedData);
  };

  return {
    formData,
    errors,
    updateField,
    handleSubmit,
  };
};

