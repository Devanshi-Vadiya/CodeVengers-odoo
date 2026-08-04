const { prisma } = require('../config/db');

const getPredictiveMaintenance = async (vehicleId) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
    include: {
      maintenanceLogs: {
        where: { status: 'closed' },
        orderBy: { closed_at: 'desc' },
        take: 1
      },
      trips: {
        include: { driver: true }
      }
    }
  });

  if (!vehicle) {
    return {
      riskPercent: 0,
      recommendation: 'Vehicle not found',
      factors: []
    };
  }

  // 1. km since last service
  const lastMaintenance = vehicle.maintenanceLogs[0];
  const odoAtLastService = lastMaintenance ? (lastMaintenance.odometerAtClose || 0) : 0;
  const kmSinceLastService = Math.max(0, vehicle.odometer - odoAtLastService);

  // 2. driver safety score average for vehicle
  const safetyScores = vehicle.trips
    .map(t => t.driver?.safety_score)
    .filter(s => s !== undefined && s !== null);
  const avgSafetyScore = safetyScores.length
    ? safetyScores.reduce((a, b) => a + b, 0) / safetyScores.length
    : 85; // default fallback

  // 3. vehicle age
  const createdYear = vehicle.createdAt ? new Date(vehicle.createdAt).getFullYear() : 2022;
  const currentYear = new Date().getFullYear();
  const vehicleAgeYears = Math.max(0, currentYear - createdYear);

  // Calculate risk % using formula from spec v1.0
  const rawRisk = (kmSinceLastService / 5000) * 50 + (100 - avgSafetyScore) * 0.3 + (vehicleAgeYears * 2);
  const riskPercent = Math.min(100, Math.max(0, Math.round(rawRisk)));

  const recommendation = riskPercent > 70
    ? 'Schedule maintenance soon'
    : riskPercent > 40
    ? 'Monitor vehicle closely'
    : 'No immediate action needed';

  const factors = [
    { name: 'Km since last service', value: `${kmSinceLastService.toLocaleString()} km`, weight: 'High' },
    { name: 'Average Driver Safety Score', value: `${Math.round(avgSafetyScore)}/100`, weight: 'Medium' },
    { name: 'Vehicle Age', value: `${vehicleAgeYears} years`, weight: 'Low' }
  ];

  return {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    regNumber: vehicle.reg_number,
    riskPercent,
    recommendation,
    factors
  };
};

const getFuelAnomalies = async () => {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: {
        where: { status: 'completed' }
      }
    }
  });

  const anomalies = [];

  for (const vehicle of vehicles) {
    const completedTrips = vehicle.trips.filter(t => t.actual_distance && t.fuel_consumed && Number(t.fuel_consumed) > 0);
    if (completedTrips.length < 2) continue; // Skip vehicles with < 2 completed trips

    const efficiencies = completedTrips.map(t => Number(t.actual_distance) / Number(t.fuel_consumed));
    const avgEfficiency = efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length;

    for (const trip of completedTrips) {
      const tripEff = Number(trip.actual_distance) / Number(trip.fuel_consumed);
      const deviationPct = Math.round(((tripEff - avgEfficiency) / avgEfficiency) * 100);

      if (Math.abs(deviationPct) > 25) {
        anomalies.push({
          vehicle_id: vehicle.id,
          vehicle_name: vehicle.name,
          trip_id: trip.id,
          source: trip.source,
          destination: trip.destination,
          tripEfficiency: Number(tripEff.toFixed(2)),
          avgEfficiency: Number(avgEfficiency.toFixed(2)),
          deviationPct,
          type: deviationPct < 0 ? 'Fuel Over-consumption' : 'Unusually High Efficiency'
        });
      }
    }
  }

  return anomalies;
};

module.exports = {
  getPredictiveMaintenance,
  getFuelAnomalies
};
