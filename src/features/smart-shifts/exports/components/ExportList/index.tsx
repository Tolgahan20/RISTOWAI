import React from 'react';
import { Download, Trash2, Clock, Loader } from 'react-feather';
import { ConfirmModal } from '@/components/dashboard/ui';
import { useExports } from '../../hooks/useExports';
import { useExportActions } from '../../hooks/useExportActions';
import { EXPORT_MESSAGES } from '../../../common/constants/messages';
import { getExportStatusIcon, getExportStatusLabel, formatExportDate } from '../../utils';
import { ExportStatus } from '../../types';
import type { Export } from '../../types';
import styles from './export-list.module.css';

interface ExportListProps {
  venueId: string;
}

export const ExportList: React.FC<ExportListProps> = ({ venueId }) => {
  const { data: exports, isLoading } = useExports(venueId);
  const {
    handleDownload,
    initiateDelete,
    confirmDelete,
    cancelDelete,
    exportToDelete,
    isDownloading,
    isDeleting,
  } = useExportActions();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader size={32} className={styles.spinner} />
        <span>{EXPORT_MESSAGES.load.loading}</span>
      </div>
    );
  }

  if (!exports || exports.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{EXPORT_MESSAGES.empty.title}</p>
        <span className={styles.emptyHint}>{EXPORT_MESSAGES.empty.description}</span>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Storico Export</h2>

        <div className={styles.list}>
          {exports.map((exportItem: Export) => (
            <div key={exportItem.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>
                    Export {formatExportDate(exportItem.startDate)} -{' '}
                    {formatExportDate(exportItem.endDate)}
                  </div>
                  <div
                    className={`${styles.statusBadge} ${styles[`status${exportItem.status}`]}`}
                  >
                    {getExportStatusIcon(
                      exportItem.status,
                      styles[`statusIcon${exportItem.status}`],
                    )}
                    <span>{getExportStatusLabel(exportItem.status)}</span>
                  </div>
                </div>

                <div className={styles.itemMeta}>
                  <Clock size={14} />
                  <span>Creato il {formatExportDate(exportItem.createdAt)}</span>
                  {exportItem.version > 1 && (
                    <span className={styles.version}>v{exportItem.version}</span>
                  )}
                </div>

                {exportItem.metadata && (
                  <div className={styles.metadata}>
                    {exportItem.metadata.totalRows !== undefined && (
                      <span className={styles.metadataItem}>
                        {exportItem.metadata.totalRows} righe
                      </span>
                    )}
                    {exportItem.metadata.totalEmployees !== undefined && (
                      <span className={styles.metadataItem}>
                        {exportItem.metadata.totalEmployees} dipendenti
                      </span>
                    )}
                  </div>
                )}

                {exportItem.notes && (
                  <div className={styles.notes}>
                    <strong>Note:</strong> {exportItem.notes}
                  </div>
                )}

                {exportItem.metadata?.validationWarnings &&
                  exportItem.metadata.validationWarnings.length > 0 && (
                    <div className={styles.warnings}>
                      <strong>Avvisi:</strong>
                      <ul>
                        {exportItem.metadata.validationWarnings.map((warning, idx) => (
                          <li key={idx}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div className={styles.itemActions}>
                <button
                  onClick={() => handleDownload(exportItem.id)}
                  disabled={
                    exportItem.status !== ExportStatus.COMPLETED || isDownloading
                  }
                  className={styles.buttonDownload}
                  title="Scarica CSV"
                >
                  <Download size={18} />
                  <span>Scarica CSV</span>
                </button>

                <button
                  onClick={() => initiateDelete(exportItem.id)}
                  disabled={isDeleting}
                  className={styles.buttonDelete}
                  title="Elimina"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!exportToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={EXPORT_MESSAGES.delete.confirm.split('?')[0]}
        message={EXPORT_MESSAGES.delete.confirm}
        confirmText="Elimina"
        cancelText="Annulla"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
