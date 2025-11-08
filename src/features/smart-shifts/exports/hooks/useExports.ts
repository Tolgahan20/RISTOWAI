import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exportsApi } from '../api/exportsApi';
import type { CreateExportRequest } from '../types';

const EXPORTS_QUERY_KEY = 'exports';

export const useExports = (venueId?: string) => {
  return useQuery({
    queryKey: [EXPORTS_QUERY_KEY, venueId],
    queryFn: () => exportsApi.getByVenue(venueId!),
    enabled: !!venueId,
  });
};

export const useExport = (exportId?: string) => {
  return useQuery({
    queryKey: [EXPORTS_QUERY_KEY, exportId],
    queryFn: () => exportsApi.getById(exportId!),
    enabled: !!exportId,
  });
};

export const useValidateExport = () => {
  return useMutation({
    mutationFn: exportsApi.validate,
  });
};

export const useCreateExport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exportsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EXPORTS_QUERY_KEY, data.venueId] });
    },
  });
};

export const useDownloadExport = () => {
  return useMutation({
    mutationFn: async (exportId: string) => {
      const blob = await exportsApi.download(exportId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${exportId}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};

export const useDeleteExport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exportsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPORTS_QUERY_KEY] });
    },
  });
};

