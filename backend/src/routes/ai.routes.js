const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get(
  '/predictive-maintenance/:vehicleId',
  authorize('fleet_manager', 'safety_officer'),
  aiController.getPredictiveMaintenance
);

router.get(
  '/fuel-anomalies',
  authorize('fleet_manager', 'financial_analyst'),
  aiController.getFuelAnomalies
);

module.exports = router;
