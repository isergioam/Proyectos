import { pool } from '../database/connection.js'

export const getHealth = (req, res) => {
    res.json({
        status: 'ok',
        message: 'API Documentos funcionando correctamente'
    })
}

export const getDbHealth = async (req, res, next) => {
    try {
        await pool.query('SELECT 1')
        res.json({
            status: 'ok',
            message: 'Conexión con MySQL correcta'
        })
    } catch (error) {
        next(error)
    }
}