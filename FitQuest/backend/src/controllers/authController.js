const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const ApiError = require('../utils/ApiError');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array().map(e => e.msg).join(', ')));
    }

    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array().map(e => e.msg).join(', ')));
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
