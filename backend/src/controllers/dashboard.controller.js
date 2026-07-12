const dashboardService = require('../services/dashboard.service');

const getKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getKPIs();
    res.status(200).json({
      success: true,
      data: kpis
    });
  } catch (error) {
    next(error);
  }
};

const getOverdue = async (req, res, next) => {
  try {
    const overdue = await dashboardService.getOverdue();
    res.status(200).json({
      success: true,
      data: overdue
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKPIs,
  getOverdue
};
