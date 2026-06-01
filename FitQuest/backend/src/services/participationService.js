const pool = require('../database/connection');
const ApiError = require('../utils/ApiError');

const join = async (userId, challengeId) => {
  const [challenges] = await pool.query('SELECT * FROM challenges WHERE id = ?', [challengeId]);

  if (challenges.length === 0) {
    throw new ApiError(404, 'Reto no encontrado');
  }

  const [existing] = await pool.query(
    'SELECT * FROM challenge_participants WHERE user_id = ? AND challenge_id = ?',
    [userId, challengeId]
  );

  if (existing.length > 0) {
    throw new ApiError(400, 'Ya estas inscrito en este reto');
  }

  await pool.query(
    'INSERT INTO challenge_participants (user_id, challenge_id) VALUES (?, ?)',
    [userId, challengeId]
  );

  return { message: 'Te has inscrito al reto exitosamente' };
};

const leave = async (userId, challengeId) => {
  const [participant] = await pool.query(
    'SELECT * FROM challenge_participants WHERE user_id = ? AND challenge_id = ? AND status = "active"',
    [userId, challengeId]
  );

  if (participant.length === 0) {
    throw new ApiError(404, 'No estas inscrito en este reto');
  }

  await pool.query(
    'UPDATE challenge_participants SET status = "abandoned" WHERE user_id = ? AND challenge_id = ?',
    [userId, challengeId]
  );

  return { message: 'Has abandonado el reto' };
};

const getMyChallenges = async (userId) => {
  const [challenges] = await pool.query(
    `SELECT c.*, cp.status, cp.joined_at,
      (SELECT COUNT(*) FROM progress_logs pl WHERE pl.user_id = ? AND pl.challenge_id = c.id) as days_completed
     FROM challenges c
     INNER JOIN challenge_participants cp ON c.id = cp.challenge_id
     WHERE cp.user_id = ?
     ORDER BY cp.joined_at DESC`,
    [userId, userId]
  );

  return challenges;
};

module.exports = { join, leave, getMyChallenges };
