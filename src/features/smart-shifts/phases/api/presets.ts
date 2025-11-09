import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';

export interface IndustryType {
  value: string;
  label: string;
}

export interface PhasePresetTemplate {
  name: string;
  startTime: string;
  endTime: string;
  type: 'HARD' | 'SOFT';
  roleRequirements: Array<{
    role: string;
    minStaff: number;
    maxStaff?: number;
  }>;
  daysOfWeek?: number[];
  notes?: string;
  priority?: number;
}

export interface IndustryPresetsResponse {
  industries: string[];
}

export interface PresetTemplatesResponse {
  industryType: string;
  templates: PhasePresetTemplate[];
}

export interface ApplyPresetRequest {
  industryType: string;
  clearExisting?: boolean;
}

/**
 * Get available industry types for phase presets
 */
export const getIndustryTypes = async (): Promise<IndustryType[]> => {
  const response = await axiosInstance.get<IndustryPresetsResponse>(
    `${api.phases.presets.industries}`
  );
  
  // Map backend industry types to friendly labels
  const industryLabels: Record<string, string> = {
    bar: '🍺 Bar',
    pizzeria: '🍕 Pizzeria',
    trattoria: '🍝 Trattoria',
    bakery: '🥖 Panificio',
    cocktail_bar: '🍸 Cocktail Bar',
    fine_dining: '⭐ Fine Dining',
  };
  
  return response.data.industries.map((industry) => ({
    value: industry,
    label: industryLabels[industry] || industry,
  }));
};

/**
 * Get phase templates for a specific industry type
 */
export const getPresetTemplates = async (
  industryType: string
): Promise<PhasePresetTemplate[]> => {
  const response = await axiosInstance.get<PresetTemplatesResponse>(
    `${api.phases.presets.templates(industryType)}`
  );
  return response.data.templates;
};

/**
 * Apply industry preset to a venue
 */
export const applyPresetToVenue = async (
  venueId: string,
  data: ApplyPresetRequest
): Promise<void> => {
  await axiosInstance.post(
    `${api.phases.presets.apply(venueId)}`,
    data
  );
};

