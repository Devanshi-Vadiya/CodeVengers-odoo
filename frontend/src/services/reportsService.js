import { delay, vehicles, trips, fuelLogs, expenses } from './mockDb';

const reportsService = {
  getFuelEfficiency: async () => {
    await delay(400);
    // Simple mock logic for reporting
    return {
      data: vehicles.map(v => {
        const vTrips = trips.filter(t => t.vehicle?.id === v.id && t.status === 'completed');
        const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id);
        const totalDist = vTrips.reduce((acc, t) => acc + (t.actual_distance || 0), 0);
        const totalFuel = vFuel.reduce((acc, f) => acc + (f.liters || 0), 0) + 
                          vTrips.reduce((acc, t) => acc + (t.fuel_consumed || 0), 0);
        return {
          vehicle_name: v.name,
          total_distance: totalDist || Math.floor(Math.random() * 500) + 100, // fallback for empty
          total_fuel: totalFuel || Math.floor(Math.random() * 100) + 20,
          efficiency: totalFuel ? (totalDist / totalFuel).toFixed(2) : (Math.random() * 5 + 3).toFixed(2)
        };
      })
    };
  },

  getUtilization: async () => {
    await delay(400);
    return {
      data: vehicles.map(v => ({
        vehicle_name: v.name,
        trip_count: trips.filter(t => t.vehicle?.id === v.id).length || Math.floor(Math.random() * 10),
        utilization_pct: Math.floor(Math.random() * 60) + 20
      }))
    };
  },

  getOpsCost: async () => {
    await delay(400);
    return {
      data: vehicles.map(v => {
        const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id);
        const vExp = expenses.filter(e => e.vehicle_id === v.id);
        const fuelCost = vFuel.reduce((acc, f) => acc + f.total_cost, 0);
        const otherCost = vExp.reduce((acc, e) => acc + e.amount, 0);
        return {
          vehicle_name: v.name,
          fuel_cost: fuelCost || Math.floor(Math.random() * 5000),
          other_cost: otherCost || Math.floor(Math.random() * 2000),
          total_cost: (fuelCost || 1000) + (otherCost || 500)
        };
      })
    };
  },

  getRoi: async () => {
    await delay(400);
    return {
      data: vehicles.map(v => ({
        vehicle_name: v.name,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        cost: Math.floor(Math.random() * 20000) + 5000,
        roi_pct: Math.floor(Math.random() * 40) + 10
      }))
    };
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
