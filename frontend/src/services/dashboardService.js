import api from './api';

const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data.data;
  },

  getOverdue: async () => {
    const response = await api.get('/dashboard/overdue');
    return response.data.data;
  }
};

export default dashboardService;
