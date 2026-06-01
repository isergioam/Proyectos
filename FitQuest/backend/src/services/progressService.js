const pool = require('../database/connection');
const ApiError = require('../utils/ApiError');

const logProgress = async (userId, challengeId, logDate, value, note) => {
  const [participant] = await pool.query(
    'SELECT * FROM challenge_participants WHERE user_id = ? AND challenge_id = ? AND status = "active"',
    [userId, challengeId]
  );

  if (participant.length === 0) {
    throw new ApiError(400, 'No estas inscrito en este reto o no esta activo');
  }

  const [existing] = await pool.query(
    'SELECT * FROM progress_logs WHERE user_id = ? AND challenge_id = ? AND log_date = ?',
    [userId, challengeId, logDate]
  );

  if (existing.length > 0) {
    throw new ApiError(400, 'Ya has registrado progreso para esta fecha');
  }

  await pool.query(
    'INSERT INTO progress_logs (user_id, challenge_id, log_date, value, note) VALUES (?, ?, ?, ?, ?)',
    [userId, challengeId, logDate, value, note || null]
  );

  return { message: 'Progreso registrado exitosamente' };
};

const getMyProgress = async (userId, challengeId) => {
  const [logs] = await pool.query(
    'SELECT * FROM progress_logs WHERE user_id = ? AND challenge_id = ? ORDER BY log_date ASC',
    [userId, challengeId]
  );

  return logs;
};

module.exports = { logProgress, getMyProgress };
