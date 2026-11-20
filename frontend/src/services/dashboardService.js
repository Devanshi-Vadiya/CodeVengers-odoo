import api from './api';
import { vehicles, trips, maintenance, fuelLogs, drivers, delay } from './mockDb';

const dashboardService = {
  getStats: async () => {
    try {
      const res = await api.get('/dashboard/kpis', { timeout: 3500 });
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[dashboardService.getStats] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const activeTrips    = trips.filter(t => t.status === 'dispatched').length;
    const totalVehicles  = vehicles.filter(v => v.status !== 'retired').length;
    const availDrivers   = drivers.filter(d => d.status === 'available').length;
    const maintAlerts    = maintenance.filter(m => m.status === 'open').length;
    const tripsToday     = trips.filter(t => t.status === 'completed').length;
    const fuelSpendWeek  = fuelLogs.reduce((acc, f) => acc + (Number(f.cost || f.total_cost) || 0), 0);
    const totalTrips     = trips.filter(t => t.status !== 'cancelled').length;
    const completedTrips = trips.filter(t => t.status === 'completed').length;
    const dispatchRate   = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 85;

    return {
      totalVehicles,
      activeTrips,
      availableDrivers: availDrivers,
      maintenanceAlerts: maintAlerts,
      completedTripsToday: tripsToday,
      fuelSpendThisWeek: fuelSpendWeek,
      dispatchRate
    };
  },

  getOverdue: async () => {
    try {
      const res = await api.get('/dashboard/overdue', { timeout: 3500 });
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[dashboardService.getOverdue] Fallback to mockDb:', err.message);
    }

    await delay(200);
    return {
      overdue: [
        { id: 1, type: 'maintenance', label: 'TRK-003 — 40,000 km Scheduled Service', dueDate: '2026-07-08', status: 'overdue' },
        { id: 2, type: 'license',     label: 'Vijay Verma — Commercial License Expired', dueDate: '2026-07-05', status: 'overdue' },
      ],
      upcoming: [
        { id: 3, type: 'maintenance', label: 'VAN-001 — Brake Pad Inspection', dueDate: '2026-07-18', status: 'upcoming' },
        { id: 4, type: 'inspection',  label: 'TRK-001 — Annual Emission Test', dueDate: '2026-07-22', status: 'upcoming' },
      ]
    };
  }
};

export default dashboardService;
