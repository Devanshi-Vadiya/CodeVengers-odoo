import api from './api';
import { vehicles, maintenance, delay } from './mockDb';

const aiService = {
  getPredictiveMaintenance: async (vehicleId) => {
    try {
      const res = await api.get(`/ai/predictive-maintenance/${vehicleId}`, { timeout: 3500 });
      if (res.data?.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[aiService.getPredictiveMaintenance] Fallback to mockDb:', err.message);
    }

    await delay(200);
    const vehicle = vehicles.find(v => v.id === Number(vehicleId)) || vehicles[0];
    if (!vehicle) {
      return {
        data: {
          riskPercent: 0,
          recommendation: 'Vehicle not found',
          factors: []
        }
      };
    }

    const closedLogs = maintenance.filter(m => m.vehicle_id === vehicle.id && m.status === 'closed');
    const kmSinceLastService = closedLogs.length ? 1200 : (vehicle.id * 1800 + 1500);

    const avgSafetyScore = 88;
    const vehicleAgeYears = Math.max(1, 2026 - (vehicle.year || 2021));

    const rawRisk = (kmSinceLastService / 5000) * 50 + (100 - avgSafetyScore) * 0.3 + (vehicleAgeYears * 2);
    const riskPercent = Math.min(100, Math.max(0, Math.round(rawRisk)));

    const recommendation = riskPercent > 70
      ? 'Schedule maintenance soon'
      : riskPercent > 40
      ? 'Monitor vehicle closely'
      : 'No immediate action needed';

    const factors = [
      { name: 'Km since last service', value: `${kmSinceLastService.toLocaleString()} km`, weight: 'High' },
      { name: 'Driver Safety Average', value: `${avgSafetyScore}/100`, weight: 'Medium' },
      { name: 'Vehicle Age', value: `${vehicleAgeYears} years`, weight: 'Low' }
    ];

    return {
      data: {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        regNumber: vehicle.reg_number,
        riskPercent,
        recommendation,
        factors
      }
    };
  },

  getFuelAnomalies: async () => {
    try {
      const res = await api.get('/ai/fuel-anomalies', { timeout: 3500 });
      if (res.data?.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[aiService.getFuelAnomalies] Fallback to mockDb:', err.message);
    }

    await delay(200);
    return {
      data: [
        {
          vehicle_id: 1,
          vehicle_name: 'TRK-001 (GJ-01-AA-1001)',
          trip_id: 4,
          source: 'Mehsana Cold Store',
          destination: 'Anand Factory',
          tripEfficiency: 6.8,
          avgEfficiency: 4.2,
          deviationPct: 62,
          type: 'Unusually High Efficiency'
        },
        {
          vehicle_id: 3,
          vehicle_name: 'VAN-001 (GJ-01-AB-2001)',
          trip_id: 1,
          source: 'Ahmedabad Depot',
          destination: 'Surat Warehouse',
          tripEfficiency: 2.1,
          avgEfficiency: 4.5,
          deviationPct: -53,
          type: 'Fuel Over-consumption'
        }
      ]
    };
  }
};

export default aiService;
