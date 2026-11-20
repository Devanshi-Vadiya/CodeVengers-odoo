import api, { checkBackendHealth } from './api';

const DEFAULT_SETTINGS = {
  fuelPricePerLiter: 1.50,
  defaultPerKmRate: 2.50,
  minSafetyScore: 75,
  maintenanceAlertDays: 7,
  speedLimitKmh: 90,
  companyName: 'TransitOps Fleet Logistics',
  systemMode: 'hybrid', // 'live', 'mock', 'hybrid'
  notificationEmail: 'fleet-admin@transitops.com',
  enableAiPredictions: true,
  enableSmsAlerts: false,
};

const settingsService = {
  getSettings: async () => {
    try {
      const res = await api.get('/settings', { timeout: 3000 });
      if (res.data?.data) {
        localStorage.setItem('fleetSettings', JSON.stringify(res.data.data.settings));
        return res.data;
      }
    } catch {
      // Graceful fallback to cached or default settings
    }

    const cached = localStorage.getItem('fleetSettings');
    const settings = cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
    return {
      success: true,
      data: {
        settings,
        backendStatus: {
          status: 'offline',
          dbStatus: 'offline',
          timestamp: new Date().toISOString(),
          version: '1.0.0 (Client Fallback)',
          environment: 'browser',
          port: 5000,
        }
      }
    };
  },

  updateSettings: async (newSettings) => {
    localStorage.setItem('fleetSettings', JSON.stringify(newSettings));
    try {
      const res = await api.put('/settings', newSettings, { timeout: 3000 });
      return res.data;
    } catch {
      // Stored locally
      return { success: true, data: newSettings, offlineSaved: true };
    }
  },

  checkHealth: async () => {
    return await checkBackendHealth();
  }
};

export default settingsService;
