import api from './api';
import { drivers, nextIdFor, delay } from './mockDb';

const driverService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/drivers', { params, timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn('[driverService.getAll] Fallback to mockDb:', err.message);
    }

    await delay(200);
    let result = [...drivers];
    if (params.status) result = result.filter(d => d.status === params.status);
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/drivers/${id}`, { timeout: 3000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn(`[driverService.getById] Fallback to mockDb for ${id}:`, err.message);
    }

    await delay(150);
    const driver = drivers.find(d => d.id === Number(id));
    if (!driver) throw new Error('Driver not found');
    return { data: driver };
  },

  create: async (data) => {
    try {
      const res = await api.post('/drivers', data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 409 || err.response?.status === 400) throw err;
      console.warn('[driverService.create] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const newDriver = {
      id: nextIdFor('drivers'),
      ...data,
      status: 'available',
    };
    drivers.unshift(newDriver);
    return { data: newDriver };
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/drivers/${id}`, data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 409) throw err;
      console.warn('[driverService.update] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const driver = drivers.find(d => d.id === Number(id));
    if (driver) Object.assign(driver, data);
    return { data: driver };
  },

  remove: async (id) => {
    try {
      const res = await api.delete(`/drivers/${id}`, { timeout: 3500 });
      if (res.data) return { success: true };
    } catch (err) {
      console.warn('[driverService.remove] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const index = drivers.findIndex(d => d.id === Number(id));
    if (index !== -1) drivers.splice(index, 1);
    return { success: true };
  },

  suspend: async (id, reason) => {
    try {
      const res = await api.patch(`/drivers/${id}/suspend`, { reason }, { timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 400) throw err;
      console.warn('[driverService.suspend] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const driver = drivers.find(d => d.id === Number(id));
    if (driver) {
      driver.status = 'suspended';
    }
    return { data: driver };
  },
};

export default driverService;
