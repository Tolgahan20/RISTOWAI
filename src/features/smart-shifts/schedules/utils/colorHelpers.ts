import type { StaffColor } from '../types';

/**
 * Generate a unique color for each staff member
 * Using a predefined palette of pleasant, distinguishable colors
 */
const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
];

/**
 * Generate colors for a list of staff IDs
 */
export const generateStaffColors = (staffIds: string[]): StaffColor[] => {
  const uniqueStaffIds = Array.from(new Set(staffIds));
  
  return uniqueStaffIds.map((staffId, index) => ({
    staffId,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));
};

/**
 * Get color for a specific staff member
 */
export const getStaffColor = (staffId: string, staffColors: StaffColor[]): string => {
  const staffColor = staffColors.find((sc) => sc.staffId === staffId);
  return staffColor?.color || COLOR_PALETTE[0];
};

/**
 * Convert hex color to RGBA with opacity
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

