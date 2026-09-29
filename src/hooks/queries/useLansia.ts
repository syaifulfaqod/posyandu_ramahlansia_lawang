import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lansiaService } from '../../services/api/lansia';

export const LANSIA_KEYS = {
  all: ['lansia'] as const,
  lists: () => [...LANSIA_KEYS.all, 'list'] as const,
  list: (filters: { kelurahan?: string; rw?: string }) => [...LANSIA_KEYS.lists(), filters] as const,
  details: () => [...LANSIA_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...LANSIA_KEYS.details(), id] as const,
};

export const useGetLansia = (kelurahan?: string, rw?: string) => {
  return useQuery({
    queryKey: LANSIA_KEYS.list({ kelurahan, rw }),
    queryFn: async () => {
      const data = await lansiaService.getAll(kelurahan, rw);
      return data.map((l: any) => ({ ...l, riwayat: l.riwayat || [] }));
    },
  });
};

export const useGetLansiaById = (id: string) => {
  return useQuery({
    queryKey: LANSIA_KEYS.detail(id),
    queryFn: () => lansiaService.getById(id),
    enabled: !!id,
  });
};

export const useCreateLansia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lansiaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.lists() });
    },
  });
};

export const useBulkCreateLansia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lansiaService.bulkCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.lists() });
    },
  });
};

export const useUpdateLansia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => lansiaService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteLansia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lansiaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LANSIA_KEYS.lists() });
    },
  });
};
