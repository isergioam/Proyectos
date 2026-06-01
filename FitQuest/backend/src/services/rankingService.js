const pool = require('../database/connection');
const ApiError = require('../utils/ApiError');

const getRanking = async (challengeId) => {
  const [challenges] = await pool.query('SELECT * FROM challenges WHERE id = ?', [challengeId]);

  if (challenges.length === 0) {
    throw new ApiError(404, 'Reto no encontrado');
  }

  const [ranking] = await pool.query(
    `SELECT u.id, u.username,
      COUNT(pl.id) as days_completed,
      COALESCE(SUM(pl.value), 0) as total_progress
     FROM challenge_participants cp
     INNER JOIN users u ON cp.user_id = u.id
     LEFT JOIN progress_logs pl ON pl.user_id = u.id AND pl.challenge_id = cp.challenge_id
     WHERE cp.challenge_id = ? AND cp.status = "active"
     GROUP BY u.id, u.username
     ORDER BY total_progress DESC, days_completed DESC`,
    [challengeId]
  );

  return ranking;
};

module.exports = { getRanking };
