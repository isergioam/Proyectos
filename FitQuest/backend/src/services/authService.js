const bcrypt = require('bcryptjs');
const pool = require('../database/connection');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const register = async (username, email, password) => {
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ? OR username = ?',
    [email, username]
  );

  if (existing.length > 0) {
    throw new ApiError(400, 'El email o nombre de usuario ya esta registrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  const user = { id: result.insertId, username, email, role: 'user' };
  const token = generateToken(user);

  return { user: { id: user.id, username, email, role: 'user' }, token };
};

const login = async (email, password) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (users.length === 0) {
    throw new ApiError(401, 'Credenciales invalidas');
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, 'Credenciales invalidas');
  }

  const token = generateToken(user);

  return {
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    token,
  };
};

const getProfile = async (userId) => {
  const [users] = await pool.query(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  return users[0];
};

module.exports = { register, login, getProfile };
