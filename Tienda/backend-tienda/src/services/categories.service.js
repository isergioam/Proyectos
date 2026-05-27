import { pool } from '../database/connection.js'

export const findAllCategories = async () => {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC')
    return rows
}

export const findCategoryById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id])
    return rows[0]
}

export const insertCategory = async ({ name }) => {
    const [result] = await pool.query(
        'INSERT INTO categories(name) VALUES (?)',
        [name]
    )

    return {
        id: result.insertId,
        name
    }
}

export const modifyCategory = async (id, { name }) => {
    const [result] = await pool.query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [name, id]
    )

    return result.affectedRows
}

export const removeCategory = async (id) => {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id])
    return result.affectedRows
}