import { pool } from "../database/connection.js";

export async function listIngredients({ q = "", limit = 50 }) {
    const like = `%${q}%`;
    const [rows] = await pool.query(
        `SELECT id, nombre
     FROM ingredientes
     WHERE (? = '' OR nombre LIKE ?)
     ORDER BY nombre ASC
     LIMIT ?`,
        [q, like, Number(limit)]
    );
    return rows;
}

export async function createIngredientIfNotExists(nombre) {
    // Intentamos insertar; si ya existe por UNIQUE, lo recuperamos
    try {
        const [res] = await pool.query(
            "INSERT INTO ingredientes (nombre) VALUES (?)",
            [nombre]
        );
        return res.insertId;
    } catch (err) {
        // Duplicate entry -> buscamos el id
        const [rows] = await pool.query(
            "SELECT id FROM ingredientes WHERE nombre = ?",
            [nombre]
        );
        if (rows[0]) return rows[0].id;
        throw err;
    }
}

export async function getIngredientById(id) {
    const [rows] = await pool.query(
        "SELECT id, nombre FROM ingredientes WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

