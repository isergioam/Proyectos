const pool = require('../database/connection');
const ApiError = require('../utils/ApiError');

const getAll = async () => {
  const [challenges] = await pool.query('SELECT * FROM challenges ORDER BY created_at DESC');
  return challenges;
};

const getById = async (id) => {
  const [challenges] = await pool.query('SELECT * FROM challenges WHERE id = ?', [id]);

  if (challenges.length === 0) {
    throw new ApiError(404, 'Reto no encontrado');
  }

  return challenges[0];
};

const create = async (data) => {
  const { title, description, duration_days, difficulty, image } = data;

  const [result] = await pool.query(
    'INSERT INTO challenges (title, description, duration_days, difficulty, image) VALUES (?, ?, ?, ?, ?)',
    [title, description || null, duration_days, difficulty, image || null]
  );

  return { id: result.insertId, ...data };
};

const update = async (id, data) => {
  const challenge = await getById(id);

  const { title, description, duration_days, difficulty, image } = data;

  await pool.query(
    'UPDATE challenges SET title = ?, description = ?, duration_days = ?, difficulty = ?, image = ? WHERE id = ?',
    [
      title || challenge.title,
      description !== undefined ? description : challenge.description,
      duration_days || challenge.duration_days,
      difficulty || challenge.difficulty,
      image !== undefined ? image : challenge.image,
      id,
    ]
  );

  return { id, ...challenge, ...data };
};

const remove = async (id) => {
  await getById(id);
  await pool.query('DELETE FROM challenges WHERE id = ?', [id]);
};

module.exports = { getAll, getById, create, update, remove };
