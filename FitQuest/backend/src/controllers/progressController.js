const { validationResult } = require('express-validator');
const progressService = require('../services/progressService');
const ApiError = require('../utils/ApiError');

const logProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array().map(e => e.msg).join(', ')));
    }

    const { challenge_id, log_date, value, note } = req.body;
    const result = await progressService.logProgress(req.user.id, challenge_id, log_date, value, note);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getMyProgress = async (req, res, next) => {
  try {
    const logs = await progressService.getMyProgress(req.user.id, req.params.challengeId);
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { logProgress, getMyProgress };
