const pool = require('../config/db')

async function getAllPrestamos() {
    const [rows] = await pool.query(
        `SELECT
       p.id,
       p.objeto_id,
       o.nombre AS objeto_nombre,
       p.prestamista_nombre,
       p.prestatario_nombre,
       p.fecha_prestamo,
       p.fecha_devolucion_prevista,
       p.fecha_devolucion_real,
       p.estado,
       p.notas,
       p.created_at,
       p.updated_at
     FROM prestamos p
     INNER JOIN objetos o ON o.id = p.objeto_id
     ORDER BY p.id DESC`
    )

    return rows
}

async function getPrestamoById(id) {
    const [rows] = await pool.query(
        `SELECT
       p.id,
       p.objeto_id,
       o.nombre AS objeto_nombre,
       p.prestamista_nombre,
       p.prestatario_nombre,
       p.fecha_prestamo,
       p.fecha_devolucion_prevista,
       p.fecha_devolucion_real,
       p.estado,
       p.notas,
       p.created_at,
       p.updated_at
     FROM prestamos p
     INNER JOIN objetos o ON o.id = p.objeto_id
     WHERE p.id = ?`,
        [id]
    )

    return rows[0] || null
}

async function createPrestamo({
    objetoId,
    prestamistaNombre,
    prestatarioNombre,
    fechaPrestamo,
    fechaDevolucionPrevista,
    notas
}) {
    const [result] = await pool.query(
        `INSERT INTO prestamos (
       objeto_id,
       prestamista_nombre,
       prestatario_nombre,
       fecha_prestamo,
       fecha_devolucion_prevista,
       fecha_devolucion_real,
       estado,
       notas
     ) VALUES (?, ?, ?, ?, ?, NULL, 'PENDIENTE', ?)`,
        [
            objetoId,
            prestamistaNombre,
            prestatarioNombre,
            fechaPrestamo,
            fechaDevolucionPrevista || null,
            notas || null
        ]
    )

    return getPrestamoById(result.insertId)
}

async function markPrestamoAsDevuelto(id, fechaDevolucionReal) {
    const [result] = await pool.query(
        `UPDATE prestamos
     SET estado = 'DEVUELTO',
         fecha_devolucion_real = ?
     WHERE id = ?`,
        [fechaDevolucionReal, id]
    )

    return result.affectedRows > 0
}

async function updateObjetoEstado(id, estado) {
    const [result] = await pool.query(
        `UPDATE objetos
     SET estado = ?
     WHERE id = ?`,
        [estado, id]
    )

    return result.affectedRows > 0
}

module.exports = {
    getAllPrestamos,
    getPrestamoById,
    createPrestamo,
    markPrestamoAsDevuelto,
    updateObjetoEstado
}