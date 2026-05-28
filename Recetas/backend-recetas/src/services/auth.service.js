import { pool } from "../database/connection.js";

export async function findUserByEmail(email) {
    const [rows] = await pool.query(
        "SELECT id, nombre, email FROM usuarios WHERE email = ?",
        [email]
    );
    return rows[0] || null;
}

export async function createUser(nombre, email) {
    const [result] = await pool.query(
        "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
        [nombre, email]
    );
    return result.insertId;
}

export async function getOrCreateUser({ nombre, email }) {
    const existing = await findUserByEmail(email);
    if (existing) return existing.id;
    return await createUser(nombre, email);
}
