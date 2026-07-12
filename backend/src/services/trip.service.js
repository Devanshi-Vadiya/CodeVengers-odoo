const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

// Helper to check if driver's license is expired
const isLicenseExpired = (licenseExpiry) => {
  return new Date(licenseExpiry) < new Date();
};

// Validate trip creation payload
const validateCreate = async (payload) => {
  const { vehicle_id, driver_id, cargo_weight } = payload;

  // 1. Check vehicle exists and cargo weight <= max capacity
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicle_id },
    include: { trips: { where: { status: 'dispatched' } } }
  });
  if (!vehicle) {
    throw new AppError('Vehicle not found', 422, 'VEHICLE_NOT_FOUND');
  }
  if (cargo_weight > vehicle.max_capacity) {
    throw new AppError(
      `Cargo weight (${cargo_weight} kg) exceeds vehicle capacity (${vehicle.max_capacity} kg)`,
      422,
      'CARGO_EXCEEDS_CAPACITY'
    );
  }

  // 2. Check vehicle is available
  if (vehicle.status !== 'available') {
    let message = 'Vehicle is unavailable';
    const activeTrip = vehicle.trips[0];
    if (activeTrip) {
      message += ` (currently assigned to trip ${activeTrip.id})`;
    }
    throw new AppError(message, 422, 'VEHICLE_UNAVAILABLE');
  }

  // 3. Check driver is available, not suspended, and license not expired
  const driver = await prisma.driver.findUnique({ where: { id: driver_id } });
  if (!driver) {
    throw new AppError('Driver not found', 422, 'DRIVER_NOT_FOUND');
  }
  if (driver.status !== 'available') {
    throw new AppError('Driver is unavailable', 422, 'DRIVER_INELIGIBLE');
  }
  if (driver.status === 'suspended') {
    throw new AppError('Driver is suspended', 422, 'DRIVER_INELIGIBLE');
  }
  if (isLicenseExpired(driver.license_expiry)) {
    throw new AppError('Driver license is expired', 422, 'DRIVER_INELIGIBLE');
  }

  return { vehicle, driver };
};

// Dispatch trip
const dispatch = async (tripId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get trip and validate current status
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true }
    });
    if (!trip) {
      throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
    }
    if (trip.status !== 'draft') {
      throw new AppError('Trip must be in draft status to dispatch', 400, 'INVALID_TRIP_STATUS');
    }

    // 2. Re-validate availability (since state may have changed)
    const vehicle = await tx.vehicle.findUnique({
      where: { id: trip.vehicle_id },
      include: { trips: { where: { status: 'dispatched', NOT: { id: tripId } } } }
    });
    if (!vehicle || vehicle.status !== 'available' || vehicle.trips.length > 0) {
      throw new AppError('Vehicle is no longer available', 422, 'VEHICLE_UNAVAILABLE');
    }

    const driver = await tx.driver.findUnique({ where: { id: trip.driver_id } });
    if (!driver || driver.status !== 'available' || driver.status === 'suspended' || isLicenseExpired(driver.license_expiry)) {
      throw new AppError('Driver is no longer eligible', 422, 'DRIVER_INELIGIBLE');
    }

    // 3. Update all three in transaction
    await tx.vehicle.update({
      where: { id: trip.vehicle_id },
      data: { status: 'on_trip' }
    });

    await tx.driver.update({
      where: { id: trip.driver_id },
      data: { status: 'on_trip' }
    });

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        status: 'dispatched',
        dispatched_at: new Date()
      }
    });

    return updatedTrip;
  });
};

// Complete trip
const complete = async (tripId, payload) => {
  const { actual_distance, fuel_consumed } = payload;

  return await prisma.$transaction(async (tx) => {
    // 1. Get trip and validate current status
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true }
    });
    if (!trip) {
      throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
    }
    if (trip.status !== 'dispatched') {
      throw new AppError('Trip must be dispatched to complete', 400, 'INVALID_TRIP_STATUS');
    }

    // 2. Update all three in transaction
    await tx.vehicle.update({
      where: { id: trip.vehicle_id },
      data: { status: 'available' }
    });

    await tx.driver.update({
      where: { id: trip.driver_id },
      data: { status: 'available' }
    });

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: {
        status: 'completed',
        actual_distance: parseInt(actual_distance),
        fuel_consumed: parseFloat(fuel_consumed),
        completed_at: new Date()
      }
    });

    return updatedTrip;
  });
};

// Cancel trip
const cancel = async (tripId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get trip and validate current status
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true }
    });
    if (!trip) {
      throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
    }
    if (!['draft', 'dispatched'].includes(trip.status)) {
      throw new AppError('Trip cannot be cancelled from current status', 400, 'INVALID_TRIP_STATUS');
    }

    // 2. Prepare updates
    const updates = {
      trip: { status: 'cancelled' },
      vehicle: trip.status === 'dispatched' ? { status: 'available' } : {},
      driver: trip.status === 'dispatched' ? { status: 'available' } : {}
    };

    // 3. Execute updates
    if (Object.keys(updates.vehicle).length > 0) {
      await tx.vehicle.update({
        where: { id: trip.vehicle_id },
        data: updates.vehicle
      });
    }

    if (Object.keys(updates.driver).length > 0) {
      await tx.driver.update({
        where: { id: trip.driver_id },
        data: updates.driver
      });
    }

    const updatedTrip = await tx.trip.update({
      where: { id: tripId },
      data: updates.trip
    });

    return updatedTrip;
  });
};

module.exports = {
  validateCreate,
  dispatch,
  complete,
  cancel
};
