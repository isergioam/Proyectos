import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
    createUser,
    findUserByEmail,
    findUserById
} from '../services/auth.service.js'

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    )
}

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await findUserByEmail(email)

        if (existingUser) {
            return res.status(409).json({
                message: 'Ya existe un usuario registrado con ese email'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await createUser({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(user)

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            token,
            user
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
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            })
        }

        const token = generateToken(user)

        res.json({
            message: 'Login correcto',
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