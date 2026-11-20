const fs = require('fs');
const path = require('path');
const { prisma } = require('../config/db');

// In-memory / file-backed settings store with sensible fleet defaults
const defaultSettings = {
  fuelPricePerLiter: 1.50,
  defaultPerKmRate: 2.50,
  minSafetyScore: 75,
  maintenanceAlertDays: 7,
  speedLimitKmh: 90,
  companyName: 'TransitOps Fleet Logistics',
  systemMode: 'hybrid', // 'live', 'mock', 'hybrid'
  notificationEmail: 'fleet-admin@transitops.com',
  enableAiPredictions: true,
  enableSmsAlerts: false,
};

let currentSettings = { ...defaultSettings };

const getSettings = async (req, res, next) => {
  try {
    // Check DB health
    let dbStatus = 'disconnected';
    try {
      if (prisma && prisma.$queryRaw) {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      }
    } catch {
      dbStatus = 'offline';
    }

    res.status(200).json({
      success: true,
      data: {
        settings: currentSettings,
        backendStatus: {
          status: 'online',
          dbStatus,
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          port: process.env.PORT || 5000,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    currentSettings = { ...currentSettings, ...updates };

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: currentSettings
    });
  } catch (error) {
    next(error);
  }
};

const getHealth = async (req, res, next) => {
  try {
    let dbStatus = 'disconnected';
    try {
      if (prisma && prisma.$queryRaw) {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      }
    } catch {
      dbStatus = 'offline';
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'TransitOps API is running!',
        dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getHealth
};
