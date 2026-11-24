import api from './api';
import { vehicles, fuelLogs, expenses, nextIdFor, delay } from './mockDb';

const vehicleService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/vehicles', { params, timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn('[vehicleService.getAll] Fallback to mockDb:', err.message);
    }

    await delay(200);
    let result = [...vehicles];
    if (params.status) result = result.filter(v => v.status === params.status);
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(v => v.name?.toLowerCase().includes(q) || v.reg_number?.toLowerCase().includes(q));
    }
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/vehicles/${id}`, { timeout: 3000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn(`[vehicleService.getById] Fallback to mockDb for ${id}:`, err.message);
    }

    await delay(150);
    const vehicle = vehicles.find(v => v.id === Number(id));
    if (!vehicle) throw new Error('Vehicle not found');
    return { data: vehicle };
  },

  create: async (data) => {
    try {
      const res = await api.post('/vehicles', data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 409 || err.response?.status === 400) throw err;
      console.warn('[vehicleService.create] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const newVehicle = {
      id: nextIdFor('vehicles'),
      ...data,
      status: 'available',
    };
    vehicles.unshift(newVehicle);
    return { data: newVehicle };
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/vehicles/${id}`, data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 409) throw err;
      console.warn('[vehicleService.update] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const vehicle = vehicles.find(v => v.id === Number(id));
    if (vehicle) Object.assign(vehicle, data);
    return { data: vehicle };
  },

  remove: async (id) => {
    try {
      const res = await api.delete(`/vehicles/${id}`, { timeout: 3500 });
      if (res.data) return { success: true };
    } catch (err) {
      console.warn('[vehicleService.remove] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const index = vehicles.findIndex(v => v.id === Number(id));
    if (index !== -1) vehicles.splice(index, 1);
    return { success: true };
  },

  getCosts: async (id) => {
    try {
      const res = await api.get(`/vehicles/${id}/costs`, { timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn('[vehicleService.getCosts] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const vId = Number(id);
    return {
      data: {
        fuelLogs: fuelLogs.filter(f => f.vehicle_id === vId),
        expenses: expenses.filter(e => e.vehicle_id === vId)
      }
    };
  },
};

export default vehicleService;
