const express = require('express');
const {
  getFuelEfficiency,
  getUtilization,
  getOperationalCost,
  getROI,
  exportReport
} = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All reports routes require authentication
router.use(authenticate);

// Fuel Efficiency Report (fleet_manager, financial_analyst)
router.get('/fuel-efficiency', authorize('fleet_manager', 'financial_analyst'), getFuelEfficiency);

// Utilization Report (fleet_manager, financial_analyst)
router.get('/utilization', authorize('fleet_manager', 'financial_analyst'), getUtilization);

// Operational Cost Report (financial_analyst only)
router.get('/operational-cost', authorize('financial_analyst'), getOperationalCost);

// ROI Report (financial_analyst only)
router.get('/roi', authorize('financial_analyst'), getROI);

// Export Report (fleet_manager, financial_analyst)
router.get('/export', authorize('fleet_manager', 'financial_analyst'), exportReport);

module.exports = router;
