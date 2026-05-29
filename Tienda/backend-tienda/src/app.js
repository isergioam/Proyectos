import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import healthRoutes from './routes/health.routes.js'
import aiRoutes from './routes/ai.routes.js'
import { notFound } from './middlewares/notFound.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())
app.use('/uploads', express.static('src/uploads'))

app.use('/api', healthRoutes)
app.use('/api', authRoutes)
app.use('/api', productsRoutes)
app.use('/api', categoriesRoutes)
app.use('/api', aiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app