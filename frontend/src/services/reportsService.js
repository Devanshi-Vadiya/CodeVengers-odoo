import api from './api';

const reportsService = {
  getFuelEfficiency: async () => {
    const response = await api.get('/reports/fuel-efficiency');
    return response.data.data;
  },

  getUtilization: async () => {
    const response = await api.get('/reports/utilization');
    return response.data.data;
  },

  getOpsCost: async () => {
    const response = await api.get('/reports/operational-cost');
    return response.data.data;
  },

  getRoi: async () => {
    const response = await api.get('/reports/roi');
    return response.data.data;
  },

  // Trigger CSV export — generates a CSV client-side from whatever data is displayed
  exportCsv: (reportType, data) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => {
          const val = row[h];
          if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val ?? '';
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export default reportsService;
