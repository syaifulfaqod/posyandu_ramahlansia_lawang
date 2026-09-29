import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pemeriksaanService } from '../../services/api/pemeriksaan';
import { LANSIA_KEYS } from './useLansia';

export const useCreatePemeriksaan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pemeriksaanService.create,
    onSuccess: () => {
      // Invalidate lansia list so the riwayat updates instantly
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.all });
    },
  });
};

export const useUpdatePemeriksaan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pemeriksaanService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.all });
    },
  });
};
