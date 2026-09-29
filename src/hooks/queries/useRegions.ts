import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { regionsService } from '../../services/api/regions';

export const REGIONS_KEYS = {
  all: ['regions'] as const,
  raw: ['regions', 'raw'] as const,
};

export function useGetRegions() {
  return useQuery({
    queryKey: REGIONS_KEYS.all,
    queryFn: async () => {
      const { data } = await apiClient.get('/regions');
      return data;
    },
  });
}

export function useGetRegionsRaw() {
  return useQuery({
    queryKey: REGIONS_KEYS.raw,
    queryFn: async () => {
      const { data } = await apiClient.get('/regions/raw');
      return data;
    },
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regionsService.createRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGIONS_KEYS.all });
    },
  });
}

export function useDeleteKelurahan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regionsService.deleteKelurahan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGIONS_KEYS.all });
    },
  });
}

export function useDeleteRW() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kelurahan, rw }: { kelurahan: string; rw: string }) => regionsService.deleteRW(kelurahan, rw),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGIONS_KEYS.all });
    },
  });
}

export function useDeleteRT() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kelurahan, rw, rt }: { kelurahan: string; rw: string; rt: string }) => regionsService.deleteRT(kelurahan, rw, rt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REGIONS_KEYS.all });
    },
  });
}
