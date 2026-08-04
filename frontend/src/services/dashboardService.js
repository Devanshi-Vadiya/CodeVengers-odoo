import { vehicles, trips, maintenance, fuelLogs, delay } from './mockDb';

const dashboardService = {
  getStats: async () => {
    await delay(300);
    const activeTrips    = trips.filter(t => t.status === 'dispatched').length;
    const totalVehicles  = vehicles.length;
    const availDrivers   = 4; // from mock drivers
    const maintAlerts    = maintenance.filter(m => m.status === 'open').length;
    const tripsToday     = trips.filter(t => t.created_at?.startsWith('2026-07-12')).length;
    const fuelSpend7d    = fuelLogs.reduce((s, f) => s + f.total_cost, 0);
    const dispatched     = trips.filter(t => ['dispatched','completed'].includes(t.status)).length;
    const total          = trips.length;
    const dispatchRate   = total ? Math.round((dispatched / total) * 100) : 0;
    return {
      totalVehicles,
      activeTrips,
      availableDrivers: availDrivers,
      maintenanceAlerts: maintAlerts,
      tripsToday,
      fuelSpend7d,
      dispatchRate,
    };
  },

  getOverdue: async () => {
    await delay(200);
    return {
      overdue: [
        { id: 1, type: 'maintenance', label: 'TRK-001 — Engine oil change',      dueDate: '2026-07-08', daysOverdue: 4 },
        { id: 2, type: 'license',     label: 'Driver D-104 — License expiry',    dueDate: '2026-07-10', daysOverdue: 2 },
      ],
      upcoming: [
        { id: 3, type: 'maintenance', label: 'VAN-002 — Tyre rotation due',      dueDate: '2026-07-15', daysOverdue: 0 },
        { id: 4, type: 'inspection',  label: 'TRK-002 — Annual inspection',      dueDate: '2026-07-18', daysOverdue: 0 },
      ],
    };
  },

};

export default dashboardService;
