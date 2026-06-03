import { body } from 'express-validator'

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio')
        .isEmail()
        .withMessage('El formato del correo electrónico no es válido'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
]

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio')
        .isEmail()
        .withMessage('El formato del correo electrónico no es válido'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
]

export const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
]

export const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('El token es obligatorio'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
]

export const verifyEmailValidation = [
    body('token')
        .notEmpty()
        .withMessage('El token es obligatorio')
]
