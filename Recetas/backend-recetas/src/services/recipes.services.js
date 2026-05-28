import { pool } from "../database/connection.js";

/**
 * Listado con paginación y filtros:
 * - q: texto en titulo/descripcion
 * - ingredientId: filtra recetas que usen ese ingrediente
 * - minStars: filtra por media >= minStars
 * - order: "recent" | "top"
 */
export async function listRecipes({ page, limit, q, ingredientId, minStars, order }) {
    const offset = (page - 1) * limit;

    // Condiciones dinámicas
    const where = [];
    const params = [];

    if (q) {
        where.push("(r.titulo LIKE ? OR r.descripcion LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
    }

    if (ingredientId) {
        where.push(`EXISTS (
      SELECT 1 FROM receta_ingredientes ri
      WHERE ri.receta_id = r.id AND ri.ingrediente_id = ?
    )`);
        params.push(Number(ingredientId));
    }

    // subquery resumen valoraciones
    const ratingJoin = `
    LEFT JOIN (
      SELECT receta_id, COUNT(*) AS rating_total, AVG(estrellas) AS rating_media
      FROM valoraciones
      GROUP BY receta_id
    ) v ON v.receta_id = r.id
  `;

    if (minStars) {
        where.push("(COALESCE(v.rating_media, 0) >= ?)");
        params.push(Number(minStars));
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const orderSql =
        order === "top"
            ? "ORDER BY COALESCE(v.rating_media, 0) DESC, r.created_at DESC"
            : "ORDER BY r.created_at DESC";

    // total
    const [countRows] = await pool.query(
        `
    SELECT COUNT(*) AS total
    FROM recetas r
    ${ratingJoin}
    ${whereSql}
    `,
        params
    );
    const total = Number(countRows[0]?.total || 0);

    // rows
    const [rows] = await pool.query(
        `
    SELECT
      r.id, r.titulo, r.descripcion, r.dificultad, r.tiempo_min, r.porciones, r.foto_url,
      r.created_at, r.updated_at,
      u.id AS autor_id, u.nombre AS autor_nombre, u.email AS autor_email,
      COALESCE(v.rating_total, 0) AS rating_total,
      v.rating_media AS rating_media
    FROM recetas r
    JOIN usuarios u ON u.id = r.autor_id
    ${ratingJoin}
    ${whereSql}
    ${orderSql}
    LIMIT ? OFFSET ?
    `,
        [...params, limit, offset]
    );

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
        data: rows,
    };
}

export async function getRecipeById(recetaId) {
    const [rows] = await pool.query(
        `SELECT
      r.*,
      u.id AS autor_id, u.nombre AS autor_nombre, u.email AS autor_email
     FROM recetas r
     JOIN usuarios u ON u.id = r.autor_id
     WHERE r.id = ?`,
        [recetaId]
    );
    return rows[0] || null;
}

export async function listRecipeIngredients(recetaId) {
    const [rows] = await pool.query(
        `SELECT
       i.id, i.nombre,
       ri.cantidad, ri.unidad
     FROM receta_ingredientes ri
     JOIN ingredientes i ON i.id = ri.ingrediente_id
     WHERE ri.receta_id = ?
     ORDER BY i.nombre ASC`,
        [recetaId]
    );
    return rows;
}

export async function createRecipe({
    autorId,
    titulo,
    descripcion,
    pasos,
    tiempo_min,
    dificultad,
    porciones,
    foto_url,
}) {
    const [res] = await pool.query(
        `INSERT INTO recetas
      (autor_id, titulo, descripcion, pasos, tiempo_min, dificultad, porciones, foto_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [autorId, titulo, descripcion, pasos, tiempo_min, dificultad, porciones, foto_url]
    );
    return res.insertId;
}

export async function updateRecipe(recetaId, fields) {
    const allowed = ["titulo", "descripcion", "pasos", "tiempo_min", "dificultad", "porciones", "foto_url"];
    const sets = [];
    const params = [];

    for (const k of allowed) {
        if (k in fields) {
            sets.push(`${k} = ?`);
            params.push(fields[k]);
        }
    }

    if (!sets.length) return 0;

    params.push(recetaId);
    const [res] = await pool.query(
        `UPDATE recetas SET ${sets.join(", ")} WHERE id = ?`,
        params
    );
    return res.affectedRows;
}

export async function deleteRecipe(recetaId) {
    const [res] = await pool.query("DELETE FROM recetas WHERE id = ?", [recetaId]);
    return res.affectedRows;
}

export async function setRecipeIngredients(recetaId, ingredients) {
    // Reemplazo simple: borramos y volvemos a insertar (didáctico y suficiente)
    await pool.query("DELETE FROM receta_ingredientes WHERE receta_id = ?", [recetaId]);

    if (!ingredients.length) return;

    const values = ingredients.map((it) => [
        recetaId,
        it.ingrediente_id,
        it.cantidad ?? null,
        it.unidad ?? null,
    ]);

    await pool.query(
        `INSERT INTO receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad)
     VALUES ?`,
        [values]
    );
}

