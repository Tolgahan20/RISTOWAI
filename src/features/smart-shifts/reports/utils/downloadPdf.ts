import { api } from '@/features/smart-shifts/common/constants/api';

/**
 * Download cost estimate PDF report
 */
export const downloadCostEstimatePdf = async (
  venueId: string,
  startDate: string,
  endDate: string,
  accessToken: string,
): Promise<void> => {
  try {
    const url = api.reports.costEstimatePdf(venueId, startDate, endDate);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    // Get filename from Content-Disposition header or generate default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `cost-estimate-${startDate}-${endDate}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

