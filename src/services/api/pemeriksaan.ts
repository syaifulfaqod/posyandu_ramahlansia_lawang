import { apiClient } from '../../lib/api-client';

export const pemeriksaanService = {
  create: async (data: any) => {
    const response = await apiClient.post('/pemeriksaan', data);
    return response.data;
  },
  update: async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.put(`/pemeriksaan/${id}`, data);
    return response.data;
  },
};
