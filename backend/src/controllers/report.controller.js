const reportService = require('../services/report.service');

const getFuelEfficiency = async (req, res, next) => {
  try {
    const report = await reportService.getFuelEfficiency();
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const getUtilization = async (req, res, next) => {
  try {
    const report = await reportService.getUtilization();
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const getOperationalCost = async (req, res, next) => {
  try {
    const report = await reportService.getOperationalCost();
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const getROI = async (req, res, next) => {
  try {
    const report = await reportService.getROI();
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const exportReport = async (req, res, next) => {
  try {
    const { type, report } = req.query;

    if (type !== 'csv') {
      return res.status(400).json({
        success: false,
        message: 'Only CSV export is supported'
      });
    }

    let reportData;
    let filename;

    switch (report) {
      case 'fuel-efficiency':
        reportData = await reportService.getFuelEfficiency();
        filename = 'fuel-efficiency-report.csv';
        break;
      case 'utilization':
        reportData = await reportService.getUtilization();
        filename = 'utilization-report.csv';
        break;
      case 'operational-cost':
        reportData = await reportService.getOperationalCost();
        filename = 'operational-cost-report.csv';
        break;
      case 'roi':
        reportData = await reportService.getROI();
        filename = 'roi-report.csv';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    const csv = reportService.jsonToCsv(reportData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFuelEfficiency,
  getUtilization,
  getOperationalCost,
  getROI,
  exportReport
};
