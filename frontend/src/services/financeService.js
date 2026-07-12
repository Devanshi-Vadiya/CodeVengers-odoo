import api from './api';

const financeService = {
  getCosts: async (vehicleId) => {
    if (!vehicleId) return null;
    const response = await api.get(`/vehicles/${vehicleId}/costs`);
    return response.data.data;
  },

  addFuelLog: async (data) => {
    const response = await api.post('/fuel-logs', data);
    return response.data.data;
  },

  addExpense: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data.data;
  }
};

export default financeService;
