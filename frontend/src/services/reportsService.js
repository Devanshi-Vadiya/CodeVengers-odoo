import api from './api';
import { delay, vehicles, trips, fuelLogs, expenses } from './mockDb';

const reportsService = {
  getFuelEfficiency: async () => {
    try {
      const res = await api.get('/reports/fuel-efficiency', { timeout: 3500 });
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map((r, i) => ({
          vehicle: `VEH-00${r.vehicle_id}`,
          name: `Vehicle ${r.vehicle_id}`,
          liters: Number(r.fuel || 0).toFixed(0),
          cost: Math.round(Number(r.fuel || 0) * 1.5),
          kmPerLiter: r.efficiency ? Number(r.efficiency).toFixed(1) : '4.5',
          trips: 5 + i
        }));
      }
    } catch (err) {
      console.warn('[reportsService.getFuelEfficiency] Fallback to mockDb:', err.message);
    }

    await delay(250);
    return vehicles.map((v, i) => {
      const vTrips = trips.filter(t => (t.vehicle?.id === v.id || t.vehicle_id === v.id) && t.status === 'completed');
      const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id);
      const totalDist = vTrips.reduce((acc, t) => acc + (t.actual_distance || 0), 0) || (300 + i * 50);
      const totalFuel = vFuel.reduce((acc, f) => acc + (Number(f.liters) || 0), 0) || (50 + i * 10);
      const efficiency = (totalDist / totalFuel).toFixed(1);
      return {
        vehicle: v.reg_number || `VEH-00${v.id}`,
        name: v.name || `Vehicle ${v.id}`,
        liters: totalFuel,
        cost: Math.round(totalFuel * 1.5),
        kmPerLiter: Number(efficiency),
        trips: vTrips.length || (2 + i)
      };
    });
  },

  getUtilization: async () => {
    try {
      const res = await api.get('/reports/utilization', { timeout: 3500 });
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map(r => ({
          vehicle: `VEH-00${r.vehicle_id}`,
          name: `Vehicle ${r.vehicle_id}`,
          activeDays: Math.round((r.utilizationPct / 100) * 30),
          totalDays: 30,
          utilization: r.utilizationPct
        }));
      }
    } catch (err) {
      console.warn('[reportsService.getUtilization] Fallback to mockDb:', err.message);
    }

    await delay(250);
    return vehicles.map((v, i) => {
      const util = Math.min(95, Math.max(35, 50 + (i * 8)));
      return {
        vehicle: v.reg_number || `VEH-00${v.id}`,
        name: v.name || `Vehicle ${v.id}`,
        activeDays: Math.round((util / 100) * 30),
        totalDays: 30,
        utilization: util
      };
    });
  },

  getOpsCost: async () => {
    try {
      const res = await api.get('/reports/operational-cost', { timeout: 3500 });
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map(r => ({
          vehicle: `VEH-00${r.vehicle_id}`,
          name: `Vehicle ${r.vehicle_id}`,
          fuel: Math.round(r.fuelCost || 0),
          maintenance: Math.round(r.maintenanceCost || 0),
          other: 450,
          total: Math.round(r.totalCost || 0) + 450
        }));
      }
    } catch (err) {
      console.warn('[reportsService.getOpsCost] Fallback to mockDb:', err.message);
    }

    await delay(250);
    return vehicles.map((v, i) => {
      const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id);
      const vExp = expenses.filter(e => e.vehicle_id === v.id);
      const fuelCost = vFuel.reduce((acc, f) => acc + (Number(f.total_cost || f.cost) || 0), 0) || (1200 + i * 200);
      const otherCost = vExp.reduce((acc, e) => acc + (Number(e.amount) || 0), 0) || (300 + i * 50);
      const maintCost = 450 + (i * 100);
      return {
        vehicle: v.reg_number || `VEH-00${v.id}`,
        name: v.name || `Vehicle ${v.id}`,
        fuel: fuelCost,
        maintenance: maintCost,
        other: otherCost,
        total: fuelCost + maintCost + otherCost
      };
    });
  },

  getRoi: async () => {
    try {
      const res = await api.get('/reports/roi', { timeout: 3500 });
      if (Array.isArray(res.data?.data)) {
        return res.data.data.map(r => {
          const rev = Math.round(r.revenue || 0);
          const cost = Math.round(r.cost || 0);
          const profit = rev - cost;
          const roiPct = r.roi ? Math.round(r.roi * 100) : Math.round((profit / (r.acquisitionCost || 30000)) * 100);
          return {
            vehicle: `VEH-00${r.vehicle_id}`,
            name: `Vehicle ${r.vehicle_id}`,
            revenue: rev,
            cost: cost,
            profit: profit,
            roi: roiPct
          };
        });
      }
    } catch (err) {
      console.warn('[reportsService.getRoi] Fallback to mockDb:', err.message);
    }

    await delay(250);
    return vehicles.map((v, i) => {
      const rev = 15000 + (i * 3500);
      const cost = 4200 + (i * 800);
      const profit = rev - cost;
      const roi = Math.round((profit / (25000 + i * 5000)) * 100);
      return {
        vehicle: v.reg_number || `VEH-00${v.id}`,
        name: v.name || `Vehicle ${v.id}`,
        revenue: rev,
        cost: cost,
        profit: profit,
        roi: roi
      };
    });
  },

  exportCsv: (reportType, data) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => {
          const val = row[h];
          if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val ?? '';
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export default reportsService;
