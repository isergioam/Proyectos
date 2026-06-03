const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const pool = require('./config/db')
const objetosRoutes = require('./routes/objetos.routes')
const prestamosRoutes = require('./routes/prestamos.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1 AS ok')

        res.status(200).json({
            status: 'ok',
            message: 'Servidor funcionando correctamente',
            database: 'ok'
        })
    } catch (error) {
        console.error('Error en healthcheck:', error)

        res.status(500).json({
            status: 'error',
            message: 'El servidor responde, pero la base de datos no está disponible'
        })
    }
})

app.use('/api/objetos', objetosRoutes)
app.use('/api/prestamos', prestamosRoutes)

app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    })
})

module.exports = app