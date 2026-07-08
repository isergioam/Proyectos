import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import documentsRoutes from './routes/documents.routes.js'
import healthRoutes from './routes/health.routes.js'
import { notFound } from './middlewares/notFound.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors())

app.use(express.json())
app.use('/uploads', express.static('src/uploads'))

app.use('/api', healthRoutes)
app.use('/api', authRoutes)
app.use('/api', documentsRoutes)

app.use(notFound)
app.use(errorHandler)

export default app