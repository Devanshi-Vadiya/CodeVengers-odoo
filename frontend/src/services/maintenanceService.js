import { maintenance, nextIdFor, delay } from './mockDb';

const maintenanceService = {
  getAll: async () => {
    await delay(300);
    return { data: [...maintenance].sort((a, b) => b.id - a.id) };
  },

  create: async (data) => {
    await delay(400);
    const newRecord = {
      id: nextIdFor('maintenance'),
      ...data,
      status: 'open',
      opened_at: new Date().toISOString(),
      closing_notes: null,
      vehicle: { id: data.vehicle_id, name: `Mock Vehicle ${data.vehicle_id}` }
    };
    maintenance.unshift(newRecord);
    return { data: newRecord };
  },

  close: async (id, closingNotes) => {
    await delay(400);
    const record = maintenance.find(m => m.id === Number(id));
    if (record) {
      record.status = 'closed';
      record.closing_notes = closingNotes;
    }
    return { data: record };
  }
};

export default maintenanceService;
