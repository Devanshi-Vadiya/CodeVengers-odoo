import { fuelLogs, expenses, nextIdFor, delay } from './mockDb';

const financeService = {
  getCosts: async (vehicleId) => {
    await delay(300);
    if (!vehicleId) return null;
    const vId = Number(vehicleId);
    
    const vFuelLogs = fuelLogs.filter(f => f.vehicle_id === vId);
    const vExpenses = expenses.filter(e => e.vehicle_id === vId);
    
    const fuelTotal = vFuelLogs.reduce((acc, f) => acc + f.total_cost, 0);
    const expenseTotal = vExpenses.reduce((acc, e) => acc + e.amount, 0);
    const maintenanceTotal = 0; // Or could be derived from maintenance records if we added cost to them
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
    await delay(400);
    const newLog = {
      id: nextIdFor('fuelLogs'),
      ...data,
      vehicle: { id: data.vehicle_id, name: `Mock Vehicle ${data.vehicle_id}` }
    };
    fuelLogs.unshift(newLog);
    return { data: newLog };
  },

  addExpense: async (data) => {
    await delay(400);
    const newExpense = {
      id: nextIdFor('expenses'),
      ...data,
      vehicle: { id: data.vehicle_id, name: `Mock Vehicle ${data.vehicle_id}` }
    };
    expenses.unshift(newExpense);
    return { data: newExpense };
  }
};

export default financeService;
