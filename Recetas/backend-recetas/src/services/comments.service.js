import { pool } from "../database/connection.js";

export async function listCommentsByRecipe(recetaId) {
    const [rows] = await pool.query(
        `SELECT c.id, c.texto, c.created_at,
            u.id AS usuario_id, u.nombre, u.email
     FROM comentarios c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.receta_id = ?
     ORDER BY c.created_at DESC`,
        [recetaId]
    );
    return rows;
}

export async function createComment({ recetaId, usuarioId, texto }) {
    const [res] = await pool.query(
        `INSERT INTO comentarios (receta_id, usuario_id, texto)
     VALUES (?, ?, ?)`,
        [recetaId, usuarioId, texto]
    );
    return res.insertId;
}

