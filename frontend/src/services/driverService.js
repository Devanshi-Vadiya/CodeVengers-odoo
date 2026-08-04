import { drivers, nextIdFor, delay } from './mockDb';

const driverService = {
  getAll: async (params = {}) => {
    await delay(300);
    let result = [...drivers];
    if (params.status) result = result.filter(d => d.status === params.status);
    return { data: result.sort((a, b) => b.id - a.id) };
  },

  getById: async (id) => {
    await delay(200);
    const driver = drivers.find(d => d.id === Number(id));
    if (!driver) throw new Error('Driver not found');
    return { data: driver };
  },

  create: async (data) => {
    await delay(400);
    const newDriver = {
      id: nextIdFor('drivers'),
      ...data,
      status: 'available',
    };
    drivers.unshift(newDriver);
    return { data: newDriver };
  },

  update: async (id, data) => {
    await delay(400);
    const driver = drivers.find(d => d.id === Number(id));
    if (driver) Object.assign(driver, data);
    return { data: driver };
  },

  remove: async (id) => {
    await delay(300);
    const index = drivers.findIndex(d => d.id === Number(id));
    if (index !== -1) drivers.splice(index, 1);
    return { success: true };
  },

  suspend: async (id, reason) => {
    await delay(400);
    const driver = drivers.find(d => d.id === Number(id));
    if (driver) {
      driver.status = 'suspended';
      // In a real DB we'd store the reason in a log, just mutate status here
    }
    return { data: driver };
  },
};

export default driverService;
