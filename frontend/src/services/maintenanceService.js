import api from './api';
import { maintenance, nextIdFor, delay } from './mockDb';

const maintenanceService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/maintenance', { params, timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn('[maintenanceService.getAll] Fallback to mockDb:', err.message);
    }

    await delay(200);
    let result = [...maintenance];
    if (params.status) result = result.filter(m => m.status === params.status);
    if (params.vehicle_id) result = result.filter(m => m.vehicle_id === Number(params.vehicle_id));
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  create: async (data) => {
    try {
      const res = await api.post('/maintenance', data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403) throw err;
      console.warn('[maintenanceService.create] Fallback to mockDb:', err.message);
    }

    await delay(250);
    const newRecord = {
      id: nextIdFor('maintenance'),
      ...data,
      status: 'open',
      opened_at: new Date().toISOString(),
      closing_notes: null,
      vehicle: { id: data.vehicle_id, name: `Vehicle ${data.vehicle_id}`, reg_number: `VEH-00${data.vehicle_id}` }
    };
    maintenance.unshift(newRecord);
    return { data: newRecord };
  },

  close: async (id, closingNotes) => {
    try {
      const res = await api.patch(`/maintenance/${id}/close`, { closing_notes: closingNotes }, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403) throw err;
      console.warn('[maintenanceService.close] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const record = maintenance.find(m => m.id === Number(id));
    if (record) {
      record.status = 'closed';
      record.closing_notes = closingNotes;
      record.closed_at = new Date().toISOString();
    }
    return { data: record };
  }
};

export default maintenanceService;
