const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
})

const env = {
    port: Number(process.env.PORT || 3000),
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: Number(process.env.DB_PORT || 3388),
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'prestamos_app'
}

module.exports = env