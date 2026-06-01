const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

module.exports = generateToken;
