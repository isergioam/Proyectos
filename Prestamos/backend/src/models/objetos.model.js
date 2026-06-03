const pool = require('../config/db')

async function getAllObjetos() {
    const [rows] = await pool.query(
        `SELECT id, nombre, descripcion, estado, created_at, updated_at
     FROM objetos
     ORDER BY id DESC`
    )

    return rows
}

async function getObjetoById(id) {
    const [rows] = await pool.query(
        `SELECT id, nombre, descripcion, estado, created_at, updated_at
     FROM objetos
     WHERE id = ?`,
        [id]
    )

    return rows[0] || null
}

async function createObjeto({ nombre, descripcion }) {
    const [result] = await pool.query(
        `INSERT INTO objetos (nombre, descripcion, estado)
     VALUES (?, ?, 'DISPONIBLE')`,
        [nombre, descripcion || null]
    )

    return getObjetoById(result.insertId)
}

async function deleteObjetoById(id) {
    const [result] = await pool.query(
        `DELETE FROM objetos
     WHERE id = ?`,
        [id]
    )

    return result.affectedRows > 0
}

module.exports = {
    getAllObjetos,
    getObjetoById,
    createObjeto,
    deleteObjetoById
}