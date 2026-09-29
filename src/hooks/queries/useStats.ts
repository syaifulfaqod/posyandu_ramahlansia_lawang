import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

export function useGetStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/stats');
      return data;
    },
  });
}
