import { trips, nextIdFor, delay } from './mockDb';

const tripService = {
  getAll: async (params = {}) => {
    await delay(300);
    let result = [...trips];
    if (params.status) result = result.filter(t => t.status === params.status);
    // Sort descending by id to show newest first
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  getById: async (id) => {
    await delay(200);
    const trip = trips.find(t => t.id === Number(id));
    if (!trip) throw new Error('Trip not found');
    return { data: trip };
  },

  create: async (data) => {
    await delay(400);
    const newTrip = {
      id: nextIdFor('trips'),
      ...data,
      status: 'draft',
      created_at: new Date().toISOString(),
      // Mock expanding relationships based on input IDs
      vehicle: { id: data.vehicle_id, name: `Mock Vehicle ${data.vehicle_id}` },
      driver: { id: data.driver_id, name: `Mock Driver ${data.driver_id}` }
    };
    trips.unshift(newTrip); // add to top
    return { data: newTrip };
  },

  dispatch: async (id) => {
    await delay(400);
    const trip = trips.find(t => t.id === Number(id));
    if (trip) trip.status = 'dispatched';
    return { data: trip };
  },

  complete: async (id, { actual_distance, fuel_consumed }) => {
    await delay(400);
    const trip = trips.find(t => t.id === Number(id));
    if (trip) {
      trip.status = 'completed';
      trip.actual_distance = Number(actual_distance);
      trip.fuel_consumed = Number(fuel_consumed);
    }
    return { data: trip };
  },

  cancel: async (id) => {
    await delay(300);
    const trip = trips.find(t => t.id === Number(id));
    if (trip) trip.status = 'cancelled';
    return { data: trip };
  },

  remove: async (id) => {
    await delay(300);
    const index = trips.findIndex(t => t.id === Number(id));
    if (index !== -1) trips.splice(index, 1);
    return { success: true };
  },
};

export default tripService;
