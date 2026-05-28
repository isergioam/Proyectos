import { pool } from '../database/connection.js'

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT id, name, email, password, role, created_at
         FROM users
         WHERE email = ?`,
        [email]
    )

    return rows[0]
}

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE id = ?`,
        [id]
    )

    return rows[0]
}

export const createUser = async ({ name, email, password }) => {
    const [result] = await pool.query(
        `INSERT INTO users(name, email, password)
         VALUES (?, ?, ?)`,
        [name, email, password]
    )

    return {
        id: result.insertId,
        name,
        email,
        role: 'user'
    }
}