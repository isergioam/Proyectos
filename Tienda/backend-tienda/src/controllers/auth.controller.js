import { createUser, findUserByEmail, findUserById } from '../services/auth.service.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        // Check if user already exists
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({
                message: 'El correo electrónico ya está registrado'
            })
        }

        // Check if this is the first user in the database
        // (Optional: if we want to make the first user an admin automatically, we can do that,
        // or just let them register as default 'user'). Let's just create as default 'user'.
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

        // Find user by email
        const user = await findUserByEmail(email)
        if (!user) {
            return res.status(400).json({
                message: 'El correo o la contraseña son incorrectos'
            })
        }

        // Compare password hashes
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'El correo o la contraseña son incorrectos'
            })
        }

        // Generate JWT token
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
        // req.user is decoded from the token in authMiddleware
        const user = await findUserById(req.user.id)
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        })
    } catch (error) {
        next(error)
    }
}
