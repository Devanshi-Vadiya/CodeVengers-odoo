const { prisma } = require('../config/db');

const getKPIs = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalVehicles,
    inMaintenance,
    activeTrips,
    availableDrivers,
    completedTripsToday,
    fuelLogsThisWeek,
    totalTrips,
    completedTrips
  ] = await Promise.all([
    // Total vehicles (not retired)
    prisma.vehicle.count({
      where: { status: { not: 'retired' } }
    }),
    // Maintenance alerts (vehicles in_shop)
    prisma.vehicle.count({
      where: { status: 'in_shop' }
    }),
    // Active trips (dispatched)
    prisma.trip.count({
      where: { status: 'dispatched' }
    }),
    // Available drivers
    prisma.driver.count({
      where: { status: 'available' }
    }),
    // Completed trips today
    prisma.trip.count({
      where: {
        status: 'completed',
        completed_at: { gte: today }
      }
    }),
    // Fuel spend this week (last 7 days)
    prisma.fuelLog.findMany({
      where: {
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { cost: true }
    }),
    // Total non-cancelled trips (for dispatch rate)
    prisma.trip.count({
      where: { status: { not: 'cancelled' } }
    }),
    // Completed trips (for dispatch rate)
    prisma.trip.count({
      where: { status: 'completed' }
    })
  ]);

  const fuelSpendThisWeek = fuelLogsThisWeek.reduce(
    (sum, log) => sum + parseFloat(log.cost), 0
  );

  const dispatchRate = totalTrips > 0
    ? Math.round((completedTrips / totalTrips) * 100)
    : 0;

  return {
    totalVehicles,
    activeTrips,
    availableDrivers,
    maintenanceAlerts: inMaintenance,
    completedTripsToday,
    fuelSpendThisWeek: Math.round(fuelSpendThisWeek),
    dispatchRate
  };
};

const getOverdue = async () => {
  // Overdue: open maintenance logs older than 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const overdueMaintenanceLogs = await prisma.maintenanceLog.findMany({
    where: {
      status: 'open',
      opened_at: { lt: sevenDaysAgo }
    },
    include: { vehicle: true },
    orderBy: { opened_at: 'asc' }
  });

  const overdue = overdueMaintenanceLogs.map(log => ({
    id: log.id,
    type: 'maintenance',
    label: `${log.vehicle.reg_number} — ${log.description.substring(0, 50)}`,
    dueDate: log.opened_at.toISOString().split('T')[0],
    status: 'overdue'
  }));

  // Upcoming: drivers with license expiring within 30 days
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const expiringDrivers = await prisma.driver.findMany({
    where: {
      license_expiry: {
        lte: thirtyDaysFromNow,
        gte: new Date()
      }
    },
    orderBy: { license_expiry: 'asc' }
  });

  const upcoming = expiringDrivers.map(driver => ({
    id: driver.id,
    type: 'license',
    label: `Driver ${driver.name} — License expiry`,
    dueDate: driver.license_expiry.toISOString().split('T')[0],
    status: 'upcoming'
  }));

  return { overdue, upcoming };
};

module.exports = {
  getKPIs,
  getOverdue
};
