import { pool } from '../database/connection.js'

export const createUserToken = async ({ userId, tokenHash, type, expiresAt }) => {
    const [result] = await pool.query(
        `INSERT INTO user_tokens (user_id, token_hash, type, expires_at)
     VALUES (?, ?, ?, ?)`,
        [userId, tokenHash, type, expiresAt]
    )

    return result.insertId
}

export const findValidToken = async ({ tokenHash, type }) => {
    const [rows] = await pool.query(
        `SELECT *
     FROM user_tokens
     WHERE token_hash = ?
       AND type = ?
       AND used_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
        [tokenHash, type]
    )

    return rows[0]
}

export const markTokenAsUsed = async (tokenId) => {
    await pool.query(
        `UPDATE user_tokens
     SET used_at = NOW()
     WHERE id = ?`,
        [tokenId]
    )
}

export const deleteUserTokensByType = async ({ userId, type }) => {
    await pool.query(
        `DELETE FROM user_tokens
     WHERE user_id = ? AND type = ?`,
        [userId, type]
    )
}