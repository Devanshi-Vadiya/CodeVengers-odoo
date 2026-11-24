const express = require('express');
const {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  closeMaintenance
} = require('../controllers/maintenance.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All maintenance routes require authentication
router.use(authenticate);

// Get all maintenance logs (fleet_manager, safety_officer, and financial_analyst) - optional filters: status, vehicle_id
router.get('/', authorize('fleet_manager', 'safety_officer', 'financial_analyst'), getAllMaintenance);

// Get maintenance log by id (fleet_manager and safety_officer)
router.get('/:id', authorize('fleet_manager', 'safety_officer'), getMaintenanceById);

// Create maintenance log (fleet_manager and safety_officer)
router.post('/', authorize('fleet_manager', 'safety_officer'), createMaintenance);

// Close maintenance log (fleet_manager and safety_officer) - requires closing_notes
router.patch('/:id/close', authorize('fleet_manager', 'safety_officer'), closeMaintenance);

module.exports = router;
