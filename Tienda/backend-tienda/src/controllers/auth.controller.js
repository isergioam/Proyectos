import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { createUser, findUserById } from '../services/auth.service.js'
import { findUserByEmail } from '../services/user.service.js'

import {
    requestPasswordReset,
    resetPassword,
    verifyEmail
} from '../services/auth.service.js'

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({
                message: 'El correo electrónico ya está registrado'
            })
        }

        const user = await createUser({ name, email, password })

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(400).json({
                message: 'El correo o la contraseña son incorrectos'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'El correo o la contraseña son incorrectos'
            })
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        )

        res.json({
            message: 'Inicio de sesión correcto',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        next(error)
    }
}

export const profile = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        res.json({ user })
    } catch (error) {
        next(error)
    }
}

export const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body
        await requestPasswordReset(email)

        res.json({
            message: 'Si el email existe, recibirás instrucciones'
        })
    } catch (error) {
        next(error)
    }
}

export const resetPasswordController = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body
        await resetPassword({ token, newPassword })

        res.json({
            message: 'Contraseña actualizada correctamente'
        })
    } catch (error) {
        next(error)
    }
}

export const verifyEmailController = async (req, res, next) => {
    try {
        const { token } = req.body
        await verifyEmail(token)

        res.json({
            message: 'Email verificado correctamente'
        })
    } catch (error) {
        next(error)
    }
}