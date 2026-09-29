import { apiClient } from '../../lib/api-client';

export const beritaService = {
  getAll: async () => {
    const response = await apiClient.get('/berita');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/berita', data);
    return response.data;
  },
  update: async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.put(`/berita/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/berita/${id}`);
    return response.data;
  },
};
