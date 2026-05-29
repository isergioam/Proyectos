import { pool } from '../database/connection.js'

export const getAvailableProductsForAI = async () => {
    const [rows] = await pool.query(
        `SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            c.name AS category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.stock > 0
         ORDER BY p.created_at DESC
         LIMIT 30`
    )

    return rows
}

export const getProductsByBudgetForAI = async (budget) => {
    const [rows] = await pool.query(
        `SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            c.name AS category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.stock > 0
           AND p.price <= ?
         ORDER BY p.price ASC
         LIMIT 30`,
        [budget]
    )

    return rows
}

export const getProductByIdForAI = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            c.name AS category_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`,
        [id]
    )

    return rows[0]
}