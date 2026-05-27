import { pool } from '../database/connection.js'
import bcrypt from 'bcrypt'

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    return rows[0]
}

export const findUserById = async (id) => {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id])
    return rows[0]
}

export const createUser = async ({ name, email, password, role = 'user' }) => {
    // Hash password with bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    )

    return {
        id: result.insertId,
        name,
        email,
        role
    }
}
