import { pool } from '../database/connection.js'

export const findPublicDocumentsWithFilters = async ({ search, type, limit, offset }) => {
    const conditions = ['d.is_public = true']
    const values = []

    if (search) {
        conditions.push('d.title LIKE ?')
        values.push(`%${search}%`)
    }

    if (type) {
        conditions.push('d.type = ?')
        values.push(type)
    }

    const where = `WHERE ${conditions.join(' AND ')}`

    const [rows] = await pool.query(
        `SELECT d.id, d.title, d.description, d.type, d.file_name, d.is_public, d.created_at, u.name AS owner
         FROM documents d
         JOIN users u ON d.user_id = u.id
         ${where}
         ORDER BY d.created_at DESC
         LIMIT ? OFFSET ?`,
        [...values, limit, offset]
    )

    return rows
}

export const countPublicDocumentsWithFilters = async ({ search, type }) => {
    const conditions = ['is_public = true']
    const values = []

    if (search) {
        conditions.push('title LIKE ?')
        values.push(`%${search}%`)
    }

    if (type) {
        conditions.push('type = ?')
        values.push(type)
    }

    const where = `WHERE ${conditions.join(' AND ')}`

    const [rows] = await pool.query(
        `SELECT COUNT(*) AS total FROM documents ${where}`,
        values
    )

    return rows[0].total
}

export const findDocumentById = async (id) => {
    const [rows] = await pool.query(
        `SELECT d.*, u.name AS owner
         FROM documents d
         JOIN users u ON d.user_id = u.id
         WHERE d.id = ?`,
        [id]
    )

    return rows[0]
}

export const findDocumentsByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT id, title, description, type, file_name, is_public, created_at, updated_at
         FROM documents
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    )

    return rows
}

export const findAllDocumentsForAdmin = async () => {
    const [rows] = await pool.query(
        `SELECT d.id, d.title, d.description, d.type, d.file_name, d.is_public, d.created_at, u.name AS owner
         FROM documents d
         JOIN users u ON d.user_id = u.id
         ORDER BY d.created_at DESC`
    )

    return rows
}

export const insertDocument = async ({ title, description, type, fileName, isPublic, userId }) => {
    const [result] = await pool.query(
        `INSERT INTO documents(title, description, type, file_name, is_public, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, type, fileName, isPublic, userId]
    )

    return {
        id: result.insertId,
        title,
        description,
        type,
        fileName,
        isPublic,
        userId
    }
}

export const modifyDocument = async (id, { title, description, type, isPublic }) => {
    const [result] = await pool.query(
        `UPDATE documents
         SET title = ?, description = ?, type = ?, is_public = ?
         WHERE id = ?`,
        [title, description, type, isPublic, id]
    )

    return result.affectedRows
}

export const removeDocument = async (id) => {
    const [result] = await pool.query('DELETE FROM documents WHERE id = ?', [id])
    return result.affectedRows
}