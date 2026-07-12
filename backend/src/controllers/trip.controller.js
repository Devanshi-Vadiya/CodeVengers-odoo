const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const tripService = require('../services/trip.service');

// Get all trips (with filtering)
const getAllTrips = async (req, res, next) => {
  try {
    const { status, vehicle_id, driver_id } = req.query;
    const where = {};

    // Filter by status if provided
    if (status) where.status = status;

    // Filter by vehicle_id if provided
    if (vehicle_id) where.vehicle_id = parseInt(vehicle_id);

    // If driver, only show their own trips (check if driver has userId linked to user)
    if (req.user.role === 'driver') {
      // First get the driver linked to current user (if any)
      const driver = await prisma.driver.findFirst({
        where: { userId: req.user.id }
      });
      if (driver) {
        where.driver_id = driver.id;
      } else {
        // If no driver linked, return empty
        return res.status(200).json({
          success: true,
          data: []
        });
      }
    } else {
      // For non-drivers, allow filtering by driver_id
      if (driver_id) where.driver_id = parseInt(driver_id);
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        vehicle: true,
        driver: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

// Get trip by ID
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(id) },
      include: { vehicle: true, driver: true }
    });

    if (!trip) {
      throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
    }

    // If driver, only allow access to their own trips
    if (req.user.role === 'driver') {
      const driver = await prisma.driver.findFirst({ where: { userId: req.user.id } });
      if (!driver || driver.id !== trip.driver_id) {
        throw new AppError('Not authorized to access this trip', 403, 'FORBIDDEN');
      }
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

// Create new trip
const createTrip = async (req, res, next) => {
  try {
    // Validate creation data using service
    await tripService.validateCreate(req.body);

    const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;

    const trip = await prisma.trip.create({
      data: {
        source,
        destination,
        vehicle_id: parseInt(vehicle_id),
        driver_id: parseInt(driver_id),
        cargo_weight: parseInt(cargo_weight),
        planned_distance: parseInt(planned_distance),
        status: 'draft'
      },
      include: { vehicle: true, driver: true }
    });

    res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

// Dispatch trip
const dispatchTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await tripService.dispatch(parseInt(id));

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

// Complete trip
const completeTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await tripService.complete(parseInt(id), req.body);

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

// Cancel trip
const cancelTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await tripService.cancel(parseInt(id));

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

// Delete trip (only manager, only draft)
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({ where: { id: parseInt(id) } });
    if (!trip) {
      throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
    }
    if (trip.status !== 'draft') {
      throw new AppError('Only draft trips can be deleted', 400, 'INVALID_TRIP_STATUS');
    }

    await prisma.trip.delete({ where: { id: parseInt(id) } });

    res.status(200).json({
      success: true,
      data: { success: true }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip
};
