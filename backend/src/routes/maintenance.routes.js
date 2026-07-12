const express = require('express');
const {
  getAllMaintenanceLogs,
  createMaintenanceLog,
  closeMaintenanceLog
} = require('../controllers/maintenance.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Fleet Manager and Safety Officer can view and manage maintenance logs
router.get('/', authenticate, authorize('fleet_manager', 'safety_officer'), getAllMaintenanceLogs);
router.post('/', authenticate, authorize('fleet_manager', 'safety_officer'), createMaintenanceLog);
router.patch('/:id/close', authenticate, authorize('fleet_manager', 'safety_officer'), closeMaintenanceLog);

module.exports = router;
