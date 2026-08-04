import { vehicles, fuelLogs, expenses, nextIdFor, delay } from './mockDb';

const vehicleService = {
  getAll: async (params = {}) => {
    await delay(300);
    let result = [...vehicles];
    if (params.status) result = result.filter(v => v.status === params.status);
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  getById: async (id) => {
    await delay(200);
    const vehicle = vehicles.find(v => v.id === Number(id));
    if (!vehicle) throw new Error('Vehicle not found');
    return { data: vehicle };
  },

  create: async (data) => {
    await delay(400);
    const newVehicle = {
      id: nextIdFor('vehicles'),
      ...data,
      status: 'available',
    };
    vehicles.unshift(newVehicle);
    return { data: newVehicle };
  },

  update: async (id, data) => {
    await delay(400);
    const vehicle = vehicles.find(v => v.id === Number(id));
    if (vehicle) Object.assign(vehicle, data);
    return { data: vehicle };
  },

  remove: async (id) => {
    await delay(300);
    const index = vehicles.findIndex(v => v.id === Number(id));
    if (index !== -1) vehicles.splice(index, 1);
    return { success: true };
  },

  getCosts: async (id) => {
    await delay(300);
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
