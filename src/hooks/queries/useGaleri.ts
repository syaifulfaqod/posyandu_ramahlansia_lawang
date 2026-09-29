import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

export function useGetGaleri() {
  return useQuery({
    queryKey: ['galeri'],
    queryFn: async () => {
      const { data } = await apiClient.get('/galeri');
      return data;
    },
  });
}

export function useAddGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData: any) => {
      const { data } = await apiClient.post('/galeri', newData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeri'] });
    },
  });
}

export function useDeleteGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/galeri/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeri'] });
    },
  });
}
