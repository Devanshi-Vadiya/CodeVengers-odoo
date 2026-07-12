const express = require('express');
const {
  getKPIs,
  getOverdue
} = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication (all roles allowed)
router.use(authenticate);

// Get KPIs
router.get('/kpis', getKPIs);

// Get overdue and upcoming returns
router.get('/overdue', getOverdue);

module.exports = router;
