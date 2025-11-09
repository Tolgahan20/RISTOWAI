import { useState } from 'react';
import { downloadCostEstimatePdf } from '../utils/downloadPdf';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';

export const useCostReportDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const showNotification = useNotificationStore((state) => state.showNotification);

  const downloadPdf = async (
    venueId: string,
    startDate: string,
    endDate: string,
  ) => {
    if (!venueId) {
      showNotification({ 
        type: 'error', 
        message: 'Nessuna venue selezionata' 
      });
      return;
    }

    setIsDownloading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        showNotification({ 
          type: 'error', 
          message: 'Token di accesso non trovato' 
        });
        return;
      }

      await downloadCostEstimatePdf(venueId, startDate, endDate, accessToken);

      showNotification({
        type: 'success',
        message: 'Report PDF scaricato con successo!',
      });
    } catch {
      showNotification({
        type: 'error',
        message: 'Errore durante il download del report PDF',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    downloadPdf,
  };
};

