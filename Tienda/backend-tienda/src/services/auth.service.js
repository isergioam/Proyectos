import { pool } from '../database/connection.js'
import bcrypt from 'bcrypt'
import { generatePlainToken, hashToken, addMinutes } from '../utils/token.util.js'
import { sendEmail } from './mail.service.js'
import { AppError } from '../utils/AppError.js'

import {
    findUserByEmail,
    updateUserPassword,
    markEmailAsVerified
} from './user.service.js'

import {
    createUserToken,
    findValidToken,
    markTokenAsUsed,
    deleteUserTokensByType
} from './user-token.service.js'

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [id]
    )
    return rows[0]
}

export const createUser = async ({ name, email, password, role = 'user' }) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    )

    return {
        id: result.insertId,
        name,
        email,
        role
    }
}

export const requestPasswordReset = async (email) => {
    const user = await findUserByEmail(email)

    if (!user) return

    await deleteUserTokensByType({
        userId: user.id,
        type: 'password_reset'
    })

    const plainToken = generatePlainToken()
    const tokenHash = hashToken(plainToken)
    const expiresAt = addMinutes(30)

    await createUserToken({
        userId: user.id,
        tokenHash,
        type: 'password_reset',
        expiresAt
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${plainToken}`

    await sendEmail({
        to: user.email,
        subject: 'Recuperación de contraseña',
        html: `
            <h1>Recuperación de contraseña</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Este enlace caduca en 30 minutos.</p>
        `
    })
}

export const resetPassword = async ({ token, newPassword }) => {
    const tokenHash = hashToken(token)

    const storedToken = await findValidToken({
        tokenHash,
        type: 'password_reset'
    })

    if (!storedToken) {
        throw new AppError('Token inválido o caducado', 400)
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await updateUserPassword({
        userId: storedToken.user_id,
        passwordHash
    })

    await markTokenAsUsed(storedToken.id)
}

export const sendEmailVerification = async (user) => {
    await deleteUserTokensByType({
        userId: user.id,
        type: 'email_verification'
    })

    const plainToken = generatePlainToken()
    const tokenHash = hashToken(plainToken)
    const expiresAt = addMinutes(60 * 24)

    await createUserToken({
        userId: user.id,
        tokenHash,
        type: 'email_verification',
        expiresAt
    })

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${plainToken}`

    await sendEmail({
        to: user.email,
        subject: 'Verifica tu cuenta',
        html: `
            <h1>Verifica tu cuenta</h1>
            <p>Gracias por registrarte.</p>
            <p>Haz clic en el siguiente enlace para verificar tu email:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>Este enlace caduca en 24 horas.</p>
        `
    })
}

export const verifyEmail = async (token) => {
    const tokenHash = hashToken(token)

    const storedToken = await findValidToken({
        tokenHash,
        type: 'email_verification'
    })

    if (!storedToken) {
        throw new AppError('Token inválido o caducado', 400)
    }

    await markEmailAsVerified(storedToken.user_id)
    await markTokenAsUsed(storedToken.id)
}