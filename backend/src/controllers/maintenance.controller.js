const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

// Get all maintenance logs
const getAllMaintenanceLogs = async (req, res, next) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: {
        vehicle: {
          select: {
            reg_number: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: {
        opened_at: 'desc'
      }
    });

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// Create a new maintenance log and put vehicle in_shop
const createMaintenanceLog = async (req, res, next) => {
  try {
    const { vehicle_id, description, cost, priority } = req.body;

    if (!vehicle_id || !description || cost === undefined || !priority) {
      return next(new AppError('vehicle_id, description, cost, and priority are required', 400));
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
    if (!vehicle) {
      return next(new AppError(`Vehicle with ID ${vehicle_id} not found`, 404));
    }

    // Transaction: Create log AND update vehicle status to in_shop
    const [newLog, updatedVehicle] = await prisma.$transaction([
      prisma.maintenanceLog.create({
        data: {
          vehicle_id,
          description,
          cost: parseFloat(cost),
          priority,
          status: 'open',
          opened_at: new Date()
        },
        include: {
          vehicle: {
            select: { reg_number: true, name: true, status: true }
          }
        }
      }),
      prisma.vehicle.update({
        where: { id: vehicle_id },
        data: { status: 'in_shop' }
      })
    ]);

    res.status(201).json({
      success: true,
      data: newLog
    });
  } catch (error) {
    next(error);
  }
};

// Close maintenance log and make vehicle available
const closeMaintenanceLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { closing_notes } = req.body;

    const log = await prisma.maintenanceLog.findUnique({ where: { id: parseInt(id) } });
    if (!log) {
      return next(new AppError(`Maintenance log with ID ${id} not found`, 404));
    }
    if (log.status === 'closed') {
      return next(new AppError('Maintenance log is already closed', 400));
    }

    // Transaction: Close log AND update vehicle status to available
    const [updatedLog, updatedVehicle] = await prisma.$transaction([
      prisma.maintenanceLog.update({
        where: { id: parseInt(id) },
        data: {
          status: 'closed',
          closing_notes,
          closed_at: new Date()
        },
        include: {
          vehicle: {
            select: { reg_number: true, name: true, status: true }
          }
        }
      }),
      prisma.vehicle.update({
        where: { id: log.vehicle_id },
        data: { status: 'available' }
      })
    ]);

    res.json({
      success: true,
      data: updatedLog
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaintenanceLogs,
  createMaintenanceLog,
  closeMaintenanceLog
};
