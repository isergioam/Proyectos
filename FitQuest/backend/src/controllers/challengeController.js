const { validationResult } = require('express-validator');
const challengeService = require('../services/challengeService');
const participationService = require('../services/participationService');
const ApiError = require('../utils/ApiError');

const getAll = async (req, res, next) => {
  try {
    const challenges = await challengeService.getAll();
    res.json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const challenge = await challengeService.getById(req.params.id);
    res.json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array().map(e => e.msg).join(', ')));
    }

    const challenge = await challengeService.create(req.body);
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array().map(e => e.msg).join(', ')));
    }

    const challenge = await challengeService.update(req.params.id, req.body);
    res.json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await challengeService.remove(req.params.id);
    res.json({ success: true, message: 'Reto eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};

const join = async (req, res, next) => {
  try {
    const result = await participationService.join(req.user.id, req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const leave = async (req, res, next) => {
  try {
    const result = await participationService.leave(req.user.id, req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getMyChallenges = async (req, res, next) => {
  try {
    const challenges = await participationService.getMyChallenges(req.user.id);
    res.json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, join, leave, getMyChallenges };
