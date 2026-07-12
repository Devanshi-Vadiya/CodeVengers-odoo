const { prisma } = require('../config/db');

/**
 * Assumptions for Revenue Calculation (documented as per requirements)
 * - Revenue per vehicle is calculated as: per-km rate × total completed-trip distance
 * - Per-km rate assumed to be $2.50 (can be adjusted later if needed)
 */
const PER_KM_RATE = 2.50;

const getFuelEfficiency = async () => {
  // Get all active vehicles (status != retired)
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: {
        not: 'retired'
      }
    }
  });

  const fuelEfficiency = await Promise.all(
    vehicles.map(async (vehicle) => {
      // Get total actual distance from completed trips for this vehicle
      const trips = await prisma.trip.findMany({
        where: {
          vehicle_id: vehicle.id,
          status: 'completed',
          actual_distance: {
            not: null
          }
        },
        select: {
          actual_distance: true
        }
      });

      const totalDistance = trips.reduce((sum, trip) => sum + (trip.actual_distance || 0), 0);

      // Get total fuel (liters) from fuel logs for this vehicle
      const fuelLogs = await prisma.fuelLog.findMany({
        where: {
          vehicle_id: vehicle.id
        },
        select: {
          liters: true
        }
      });

      const totalFuel = fuelLogs.reduce((sum, log) => sum + parseFloat(log.liters), 0);

      // Calculate efficiency (distance / fuel)
      let efficiency = null;
      if (totalFuel > 0) {
        efficiency = totalDistance / totalFuel;
      }

      return {
        vehicle_id: vehicle.id,
        distance: totalDistance,
        fuel: totalFuel,
        efficiency
      };
    })
  );

  return fuelEfficiency;
};

const getUtilization = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: {
        not: 'retired'
      }
    }
  });

  const utilization = await Promise.all(
    vehicles.map(async (vehicle) => {
      // Count total completed trips for this vehicle
      const completedTrips = await prisma.trip.count({
        where: {
          vehicle_id: vehicle.id,
          status: 'completed'
        }
      });

      // For simplicity, let's assume utilization is based on completed trips vs total possible
      // But since we don't have a time frame, let's use a simple metric:
      // % of time the vehicle was on a trip (using trip status counts)
      // Alternatively, let's use completed trips as a proxy
      // Wait, the requirement says [{vehicle_id, utilizationPct}]
      // Let's define utilizationPct as (number of completed trips / total trips) * 100
      const totalTrips = await prisma.trip.count({
        where: {
          vehicle_id: vehicle.id
        }
      });

      let utilizationPct = 0;
      if (totalTrips > 0) {
        utilizationPct = Math.round((completedTrips / totalTrips) * 100);
      }

      return {
        vehicle_id: vehicle.id,
        utilizationPct
      };
    })
  );

  return utilization;
};

const getOperationalCost = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: {
        not: 'retired'
      }
    }
  });

  const operationalCost = await Promise.all(
    vehicles.map(async (vehicle) => {
      // Total fuel cost from fuel logs
      const fuelLogs = await prisma.fuelLog.findMany({
        where: {
          vehicle_id: vehicle.id
        },
        select: {
          cost: true
        }
      });

      const fuelCost = fuelLogs.reduce((sum, log) => sum + parseFloat(log.cost), 0);

      // Total maintenance cost from closed maintenance logs
      const maintenanceLogs = await prisma.maintenanceLog.findMany({
        where: {
          vehicle_id: vehicle.id,
          status: 'closed'
        },
        select: {
          cost: true
        }
      });

      const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + parseFloat(log.cost), 0);

      return {
        vehicle_id: vehicle.id,
        fuelCost,
        maintenanceCost,
        totalCost: fuelCost + maintenanceCost
      };
    })
  );

  return operationalCost;
};

const getROI = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: {
        not: 'retired'
      }
    }
  });

  const roi = await Promise.all(
    vehicles.map(async (vehicle) => {
      // Calculate total completed-trip distance
      const trips = await prisma.trip.findMany({
        where: {
          vehicle_id: vehicle.id,
          status: 'completed',
          actual_distance: {
            not: null
          }
        },
        select: {
          actual_distance: true
        }
      });

      const totalDistance = trips.reduce((sum, trip) => sum + (trip.actual_distance || 0), 0);

      // Revenue = per-km rate × total distance
      const revenue = totalDistance * PER_KM_RATE;

      // Get fuel cost and maintenance cost
      const fuelLogs = await prisma.fuelLog.findMany({
        where: {
          vehicle_id: vehicle.id
        },
        select: {
          cost: true
        }
      });

      const fuelCost = fuelLogs.reduce((sum, log) => sum + parseFloat(log.cost), 0);

      const maintenanceLogs = await prisma.maintenanceLog.findMany({
        where: {
          vehicle_id: vehicle.id,
          status: 'closed'
        },
        select: {
          cost: true
        }
      });

      const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + parseFloat(log.cost), 0);

      const cost = fuelCost + maintenanceCost;
      const acquisitionCost = parseFloat(vehicle.acquisition_cost);

      let roiValue = null;
      if (acquisitionCost > 0) {
        roiValue = (revenue - cost) / acquisitionCost;
      }

      return {
        vehicle_id: vehicle.id,
        revenue,
        cost,
        acquisitionCost,
        roi: roiValue
      };
    })
  );

  return roi;
};

// Helper function to convert JSON to CSV
const jsonToCsv = (data) => {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if value contains commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
};

module.exports = {
  getFuelEfficiency,
  getUtilization,
  getOperationalCost,
  getROI,
  jsonToCsv
};
