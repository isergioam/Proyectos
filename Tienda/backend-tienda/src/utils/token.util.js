import crypto from 'crypto'

export const generatePlainToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

export const addMinutes = (minutes) => {
    const date = new Date()
    date.setMinutes(date.getMinutes() + minutes)
    return date
}