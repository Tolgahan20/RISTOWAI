import { useState } from 'react';
import { useDownloadExport, useDeleteExport } from './useExports';
import { useNotificationStore } from '../../common/stores/notification';
import { EXPORT_MESSAGES } from '../../common/constants/messages';

export const useExportActions = () => {
  const [exportToDelete, setExportToDelete] = useState<string | null>(null);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const downloadMutation = useDownloadExport();
  const deleteMutation = useDeleteExport();

  const handleDownload = (exportId: string) => {
    downloadMutation.mutate(exportId, {
      onSuccess: () => {
        showNotification({ 
          message: EXPORT_MESSAGES.download.success, 
          type: 'success' 
        });
      },
      onError: () => {
        showNotification({ 
          message: EXPORT_MESSAGES.download.error, 
          type: 'error' 
        });
      },
    });
  };

  const initiateDelete = (exportId: string) => {
    setExportToDelete(exportId);
  };

  const confirmDelete = () => {
    if (exportToDelete) {
      deleteMutation.mutate(exportToDelete, {
        onSuccess: () => {
          showNotification({ 
            message: EXPORT_MESSAGES.delete.success, 
            type: 'success' 
          });
          setExportToDelete(null);
        },
        onError: () => {
          showNotification({ 
            message: EXPORT_MESSAGES.delete.error, 
            type: 'error' 
          });
        },
      });
    }
  };

  const cancelDelete = () => {
    setExportToDelete(null);
  };

  return {
    handleDownload,
    initiateDelete,
    confirmDelete,
    cancelDelete,
    exportToDelete,
    isDownloading: downloadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    downloadError: downloadMutation.error,
    deleteError: deleteMutation.error,
  };
};

