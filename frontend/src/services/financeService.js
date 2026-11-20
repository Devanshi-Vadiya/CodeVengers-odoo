import api from './api';
import { fuelLogs, expenses, nextIdFor, delay } from './mockDb';

const financeService = {
  getCosts: async (vehicleId) => {
    if (!vehicleId) return null;
    const vId = Number(vehicleId);

    try {
      const res = await api.get(`/vehicles/${vId}/costs`, { timeout: 3500 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      console.warn('[financeService.getCosts] Fallback to mockDb:', err.message);
    }

    await delay(150);
    const vFuelLogs = fuelLogs.filter(f => f.vehicle_id === vId);
    const vExpenses = expenses.filter(e => e.vehicle_id === vId);
    
    const fuelTotal = vFuelLogs.reduce((acc, f) => acc + (Number(f.total_cost || f.cost) || 0), 0);
    const expenseTotal = vExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const maintenanceTotal = 0;
    const operationalCost = fuelTotal + expenseTotal + maintenanceTotal;

    return {
      data: {
        fuelTotal,
        expenseTotal,
        maintenanceTotal,
        operationalCost
      }
    };
  },

  addFuelLog: async (data) => {
    try {
      const res = await api.post('/fuel-logs', data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403) throw err;
      console.warn('[financeService.addFuelLog] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const newLog = {
      id: nextIdFor('fuelLogs'),
      ...data,
      vehicle: { id: data.vehicle_id, name: `Vehicle ${data.vehicle_id}` }
    };
    fuelLogs.unshift(newLog);
    return { data: newLog };
  },

  addExpense: async (data) => {
    try {
      const res = await api.post('/expenses', data, { timeout: 4000 });
      if (res.data?.data) {
        return { data: res.data.data };
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403) throw err;
      console.warn('[financeService.addExpense] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const newExpense = {
      id: nextIdFor('expenses'),
      ...data,
      vehicle: { id: data.vehicle_id, name: `Vehicle ${data.vehicle_id}` }
    };
    expenses.unshift(newExpense);
    return { data: newExpense };
  },

  getAllExpenses: async (params = {}) => {
    try {
      const res = await api.get('/expenses', { params, timeout: 3500 });
      if (res.data?.data) return { data: res.data.data };
    } catch {
      // Fallback
    }
    return { data: [...expenses] };
  },

  getAllFuelLogs: async (params = {}) => {
    try {
      const res = await api.get('/fuel-logs', { params, timeout: 3500 });
      if (res.data?.data) return { data: res.data.data };
    } catch {
      // Fallback
    }
    return { data: [...fuelLogs] };
  }
};

export default financeService;
