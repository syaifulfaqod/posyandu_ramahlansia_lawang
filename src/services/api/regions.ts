import { apiClient } from '../../lib/api-client';

export const regionsService = {
  createRegion: async (data: { kelurahan: string; rw?: string; rt?: string }) => {
    const response = await apiClient.post('/regions', data);
    return response.data;
  },
  deleteKelurahan: async (kelurahan: string) => {
    const response = await apiClient.delete(`/regions/kelurahan/${encodeURIComponent(kelurahan)}`);
    return response.data;
  },
  deleteRW: async (kelurahan: string, rw: string) => {
    const response = await apiClient.delete(`/regions/rw/${encodeURIComponent(kelurahan)}/${encodeURIComponent(rw)}`);
    return response.data;
  },
  deleteRT: async (kelurahan: string, rw: string, rt: string) => {
    const response = await apiClient.delete(`/regions/rt/${encodeURIComponent(kelurahan)}/${encodeURIComponent(rw)}/${encodeURIComponent(rt)}`);
    return response.data;
  }
};
