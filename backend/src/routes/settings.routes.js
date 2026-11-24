const express = require('express');
const { getSettings, updateSettings, getHealth } = require('../controllers/settings.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public health check
router.get('/health', getHealth);

// All authenticated roles can view system settings and connection status
router.get('/', authenticate, getSettings);

// Only fleet managers can update global settings
router.put('/', authenticate, authorize('fleet_manager'), updateSettings);

module.exports = router;
