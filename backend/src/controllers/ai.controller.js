const aiService = require('../services/ai.service');

const getPredictiveMaintenance = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const result = await aiService.getPredictiveMaintenance(vehicleId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getFuelAnomalies = async (req, res, next) => {
  try {
    const anomalies = await aiService.getFuelAnomalies();
    res.json({ success: true, data: anomalies });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPredictiveMaintenance,
  getFuelAnomalies
};
