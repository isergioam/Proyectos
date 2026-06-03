import { pool } from '../database/connection.js'

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
    )

    return rows[0]
}

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [id]
    )

    return rows[0]
}

export const updateUserPassword = async ({ userId, passwordHash }) => {
    await pool.query(
        `UPDATE users
     SET password = ?
     WHERE id = ?`,
        [passwordHash, userId]
    )
}

export const markEmailAsVerified = async (userId) => {
    await pool.query(
        `UPDATE users
     SET email_verified = true
     WHERE id = ?`,
        [userId]
    )
}