/**
 * Schedule status helper functions
 */

export type ScheduleStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | string;

/**
 * Get CSS class name for status badge color
 */
export function getStatusColor(status: ScheduleStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'statusPublished';
    case 'DRAFT':
      return 'statusDraft';
    case 'ARCHIVED':
      return 'statusArchived';
    default:
      return '';
  }
}

/**
 * Get localized status label
 */
export function getStatusLabel(status: ScheduleStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Pubblicato';
    case 'DRAFT':
      return 'Bozza';
    case 'ARCHIVED':
      return 'Archiviato';
    default:
      return status;
  }
}

