import { apiClient } from '../../lib/api-client';

export const userService = {
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },
  update: async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
  unlock: async (id: string) => {
    const response = await apiClient.post(`/users/${id}/unlock`);
    return response.data;
  }
};
