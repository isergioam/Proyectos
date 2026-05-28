import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import recetasRoutes from './routes/recetas.routes.js'
import { notFound } from './middlewares/notFound.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}))

app.use(express.json())
app.use('/uploads', express.static('src/uploads'))

app.use('/api', authRoutes)
app.use('/api', recetasRoutes)

app.use(notFound)
app.use(errorHandler)

export default app