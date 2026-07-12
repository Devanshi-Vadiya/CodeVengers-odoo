import api from './api';

const maintenanceService = {
  // Get all maintenance logs
  getAll: async () => {
    const response = await api.get('/maintenance');
    return response.data.data;
  },

  // Create a new maintenance log (automatically puts vehicle in_shop)
  create: async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data.data;
  },

  // Close a maintenance log (automatically puts vehicle back to available)
  close: async (id, closingNotes) => {
    const response = await api.patch(`/maintenance/${id}/close`, { closing_notes: closingNotes });
    return response.data.data;
  }
};

export default maintenanceService;
