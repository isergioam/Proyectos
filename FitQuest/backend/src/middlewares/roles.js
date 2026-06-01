const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'No autenticado'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'No tienes permisos para esta accion'));
    }

    next();
  };
};

module.exports = authorize;
