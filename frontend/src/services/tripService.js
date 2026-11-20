import api from './api';
import { trips, nextIdFor, delay } from './mockDb';

const tripService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/trips', { params, timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn('[tripService.getAll] Fallback to mockDb:', err.message);
    }

    await delay(200);
    let result = [...trips];
    if (params.status) result = result.filter(t => t.status === params.status);
    if (params.driver_id) result = result.filter(t => t.driver_id === Number(params.driver_id) || t.driver?.id === Number(params.driver_id));
    if (params.vehicle_id) result = result.filter(t => t.vehicle_id === Number(params.vehicle_id) || t.vehicle?.id === Number(params.vehicle_id));
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/trips/${id}`, { timeout: 3000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn(`[tripService.getById] Fallback to mockDb for ${id}:`, err.message);
    }

    await delay(150);
    const trip = trips.find(t => t.id === Number(id));
    if (!trip) throw new Error('Trip not found');
    return { data: trip };
  },

  create: async (data) => {
    try {
      const res = await api.post('/trips', data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      // Re-throw business rule violations (422) so UI can toast them (e.g. CARGO_EXCEEDS_CAPACITY, VEHICLE_UNAVAILABLE)
      if (err.response?.status === 422 || err.response?.status === 400 || err.response?.status === 403) {
        throw err;
      }
      console.warn('[tripService.create] Fallback to mockDb:', err.message);
    }

    await delay(250);
    const newTrip = {
      id: nextIdFor('trips'),
      ...data,
      status: 'draft',
      created_at: new Date().toISOString(),
      vehicle: { id: data.vehicle_id, name: `Vehicle ${data.vehicle_id}` },
      driver: { id: data.driver_id, name: `Driver ${data.driver_id}` }
    };
    trips.unshift(newTrip);
    return { data: newTrip };
  },

  dispatch: async (id) => {
    try {
      const res = await api.patch(`/trips/${id}/dispatch`, {}, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 400 || err.response?.status === 403) throw err;
      console.warn('[tripService.dispatch] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const trip = trips.find(t => t.id === Number(id));
    if (trip) trip.status = 'dispatched';
    return { data: trip };
  },

  complete: async (id, { actual_distance, fuel_consumed }) => {
    try {
      const res = await api.patch(`/trips/${id}/complete`, { actual_distance, fuel_consumed }, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 400 || err.response?.status === 403) throw err;
      console.warn('[tripService.complete] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const trip = trips.find(t => t.id === Number(id));
    if (trip) {
      trip.status = 'completed';
      trip.actual_distance = Number(actual_distance);
      trip.fuel_consumed = Number(fuel_consumed);
    }
    return { data: trip };
  },

  cancel: async (id) => {
    try {
      const res = await api.patch(`/trips/${id}/cancel`, {}, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 400) throw err;
      console.warn('[tripService.cancel] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const trip = trips.find(t => t.id === Number(id));
    if (trip) trip.status = 'cancelled';
    return { data: trip };
  },

  remove: async (id) => {
    try {
      const res = await api.delete(`/trips/${id}`, { timeout: 3500 });
      if (res.data) return { success: true };
    } catch (err) {
      console.warn('[tripService.remove] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const index = trips.findIndex(t => t.id === Number(id));
    if (index !== -1) trips.splice(index, 1);
    return { success: true };
  },
};

export default tripService;
