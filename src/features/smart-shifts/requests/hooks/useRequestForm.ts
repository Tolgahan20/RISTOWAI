import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../api';
import { useNotificationStore } from '../../common/stores/notification';
import { REQUEST_MESSAGES } from '../../common/constants/messages';
import type { Request, CreateRequestRequest, UpdateRequestRequest, RequestType, RequestPriority } from '../types';

interface UseRequestFormProps {
  venueId: string;
  request?: Request;
  onSuccess?: () => void;
}

export const useRequestForm = ({ venueId, request, onSuccess }: UseRequestFormProps) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  const [formData, setFormData] = useState<CreateRequestRequest>({
    staffId: request?.staffId || '',
    type: request?.type || ('TIME_OFF' as RequestType),
    priority: request?.priority || ('NORMAL' as RequestPriority),
    startDate: request?.startDate ? request.startDate.split('T')[0] : '',
    endDate: request?.endDate ? request.endDate.split('T')[0] : '',
    reason: request?.reason || '',
    notes: request?.notes || '',
    targetShiftId: request?.targetShiftId || '',
    swapWithStaffId: request?.swapWithStaffId || '',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRequestRequest) => requestsApi.create(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', venueId] });
      queryClient.invalidateQueries({ queryKey: ['requestStats', venueId] });
      showNotification({
        type: 'success',
        message: REQUEST_MESSAGES.create.success,
      });
      onSuccess?.();
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.create.error,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateRequestRequest) =>
      requestsApi.update(venueId, request!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', venueId] });
      queryClient.invalidateQueries({ queryKey: ['request', venueId, request?.id] });
      showNotification({
        type: 'success',
        message: REQUEST_MESSAGES.update.success,
      });
      onSuccess?.();
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.update.error,
      });
    },
  });

  const handleSubmit = () => {
    // Validate dates
    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      // Set times to start of day for fair comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (endDate < startDate) {
        showNotification({
          type: 'error',
          message: REQUEST_MESSAGES.validation.endDateBeforeStart,
        });
        return;
      }
    }

    // Validate shift swap requirements
    if (formData.type === 'SHIFT_SWAP' && !formData.targetShiftId) {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.validation.missingShift,
      });
      return;
    }

    if (request) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return {
    formData,
    setFormData,
    handleSubmit,
    isLoading,
  };
};

