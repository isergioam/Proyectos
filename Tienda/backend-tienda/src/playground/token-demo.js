import { generatePlainToken, hashToken } from '../utils/token.util.js'

const token = generatePlainToken()
const tokenHash = hashToken(token)

console.log('Token real:', token)
console.log('Hash guardado:', tokenHash)