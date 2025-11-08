import React from 'react';
import { CheckCircle, XCircle, Loader } from 'react-feather';
import { ExportStatus } from '../types';
import { EXPORT_MESSAGES } from '../../common/constants/messages';

export const getExportStatusIcon = (
  status: ExportStatus,
  className?: string,
): React.ReactNode => {
  switch (status) {
    case ExportStatus.COMPLETED:
      return <CheckCircle size={18} className={className} />;
    case ExportStatus.PROCESSING:
    case ExportStatus.PENDING:
      return <Loader size={18} className={className} />;
    case ExportStatus.FAILED:
      return <XCircle size={18} className={className} />;
    default:
      return null;
  }
};

export const getExportStatusLabel = (status: ExportStatus): string => {
  switch (status) {
    case ExportStatus.COMPLETED:
      return EXPORT_MESSAGES.status.completed;
    case ExportStatus.PROCESSING:
      return EXPORT_MESSAGES.status.processing;
    case ExportStatus.PENDING:
      return EXPORT_MESSAGES.status.pending;
    case ExportStatus.FAILED:
      return EXPORT_MESSAGES.status.failed;
    default:
      return status;
  }
};

export const formatExportDate = (date: string): string => {
  return new Date(date).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

