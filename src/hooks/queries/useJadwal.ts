import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jadwalService } from '../../services/api/jadwal';

export const JADWAL_KEYS = {
  all: ['jadwal'] as const,
};

export const useGetJadwal = () => {
  return useQuery({
    queryKey: JADWAL_KEYS.all,
    queryFn: jadwalService.getAll,
  });
};

export const useCreateJadwal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jadwalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JADWAL_KEYS.all });
    },
  });
};

export const useUpdateJadwal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jadwalService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JADWAL_KEYS.all });
    },
  });
};

export const useDeleteJadwal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jadwalService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JADWAL_KEYS.all });
    },
  });
};
