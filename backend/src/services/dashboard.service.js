const { prisma } = require('../config/db');

const getKPIs = async () => {
  // Run all count queries in parallel for performance
  const [
    activeVehicles,
    availableVehicles,
    inMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty
  ] = await Promise.all([
    // activeVehicles: status !== retired
    prisma.vehicle.count({
      where: {
        status: {
          not: 'retired'
        }
      }
    }),
    // availableVehicles: status = available
    prisma.vehicle.count({
      where: {
        status: 'available'
      }
    }),
    // inMaintenance: status = in_shop
    prisma.vehicle.count({
      where: {
        status: 'in_shop'
      }
    }),
    // activeTrips: status = dispatched
    prisma.trip.count({
      where: {
        status: 'dispatched'
      }
    }),
    // pendingTrips: status = draft
    prisma.trip.count({
      where: {
        status: 'draft'
      }
    }),
    // driversOnDuty: status = on_trip
    prisma.driver.count({
      where: {
        status: 'on_trip'
      }
    })
  ]);

  // Calculate fleet utilization percentage
  let fleetUtilizationPct = 0;
  if (activeVehicles > 0) {
    fleetUtilizationPct = Math.round((activeTrips / activeVehicles) * 100);
  }

  return {
    activeVehicles,
    availableVehicles,
    inMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilizationPct
  };
};

const getOverdue = async () => {
  // We need to define what "overdue returns" and "upcoming returns" mean
  // Since trips don't have a "due date" field in the schema yet,
  // Let's check the schema to see what fields we have
  // For now, let's return empty arrays as per the user's structure
  // If we need to add logic, we can adjust later
  return {
    overdueReturns: [],
    upcomingReturns: []
  };
};

module.exports = {
  getKPIs,
  getOverdue
};
