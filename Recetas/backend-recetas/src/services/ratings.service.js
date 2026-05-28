import { pool } from "../database/connection.js";

/**
 * Inserta o actualiza (1 rating por usuario/receta)
 */
export async function upsertRating({ recetaId, usuarioId, estrellas }) {
    await pool.query(
        `INSERT INTO valoraciones (receta_id, usuario_id, estrellas)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE estrellas = VALUES(estrellas)`,
        [recetaId, usuarioId, estrellas]
    );
}

export async function getRecipeRatingSummary(recetaId) {
    const [rows] = await pool.query(
        `SELECT
        COUNT(*) AS total,
        AVG(estrellas) AS media
     FROM valoraciones
     WHERE receta_id = ?`,
        [recetaId]
    );

    const total = Number(rows[0]?.total || 0);
    const media = rows[0]?.media === null ? null : Number(rows[0].media);
    return { total, media };
}

