import { apiClient } from '../../lib/api-client';

export const jadwalService = {
  getAll: async () => {
    const response = await apiClient.get('/jadwal');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/jadwal', data);
    return response.data;
  },
  update: async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.put(`/jadwal/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/jadwal/${id}`);
    return response.data;
  },
};
