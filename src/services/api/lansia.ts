import { apiClient } from '../../lib/api-client';

export const lansiaService = {
  getAll: async (kelurahan?: string, rw?: string) => {
    const params = new URLSearchParams();
    if (kelurahan) params.append('kelurahan', kelurahan);
    if (rw) params.append('rw', rw);
    
    const response = await apiClient.get(`/lansia?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/lansia/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/lansia', data);
    return response.data;
  },

  bulkCreate: async (data: any[]) => {
    const response = await apiClient.post('/lansia/bulk', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/lansia/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/lansia/${id}`);
    return response.data;
  }
};
