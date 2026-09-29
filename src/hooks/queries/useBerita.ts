import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beritaService } from '../../services/api/berita';

export const BERITA_KEYS = {
  all: ['berita'] as const,
};

export const useGetBerita = () => {
  return useQuery({
    queryKey: BERITA_KEYS.all,
    queryFn: beritaService.getAll,
  });
};

export const useCreateBerita = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: beritaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BERITA_KEYS.all });
    },
  });
};

export const useUpdateBerita = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: beritaService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BERITA_KEYS.all });
    },
  });
};

export const useDeleteBerita = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: beritaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BERITA_KEYS.all });
    },
  });
};
