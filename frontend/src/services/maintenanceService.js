import api from './api';

const maintenanceService = {
  getAll: async () => {
    const response = await api.get('/maintenance');
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data.data;
  },

  close: async (id, closingNotes) => {
    const response = await api.patch(`/maintenance/${id}/close`, { closing_notes: closingNotes });
    return response.data.data;
  }
};

export default maintenanceService;
