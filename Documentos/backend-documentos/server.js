import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'API'

app.listen(PORT, () => {
    console.log(`${APP_NAME} funcionando en http://localhost:${PORT}`)
})