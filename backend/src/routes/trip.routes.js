const express = require('express');
const {
  getAllTrips,
  getTripById,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip
} = require('../controllers/trip.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All trip routes require authentication
router.use(authenticate);

// Get all trips (all roles)
router.get('/', getAllTrips);

// Get trip by ID (all roles)
router.get('/:id', getTripById);

// Create trip (fleet_manager or driver)
router.post('/', authorize('fleet_manager', 'driver'), createTrip);

// Dispatch trip (fleet_manager or driver)
router.patch('/:id/dispatch', authorize('fleet_manager', 'driver'), dispatchTrip);

// Complete trip (fleet_manager or driver)
router.patch('/:id/complete', authorize('fleet_manager', 'driver'), completeTrip);

// Cancel trip (fleet_manager or driver)
router.patch('/:id/cancel', authorize('fleet_manager', 'driver'), cancelTrip);

// Delete trip (fleet_manager only, only if draft)
router.delete('/:id', authorize('fleet_manager'), deleteTrip);

module.exports = router;
