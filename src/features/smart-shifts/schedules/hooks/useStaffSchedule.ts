import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api';

export const useStaffSchedule = (staffId: string | null) => {
  return useQuery({
    queryKey: ['staffSchedule', staffId],
    queryFn: () => schedulesApi.getStaffSchedule(staffId!),
    enabled: !!staffId,
  });
};

