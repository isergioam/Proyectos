import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const dbHost = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1')
const dbPort = Number(process.env.DB_PORT) || 3388

const adapter = new PrismaMariaDb({
  host: dbHost,
  port: dbPort,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tienda_db',
})

export const prisma = new PrismaClient({ adapter })
