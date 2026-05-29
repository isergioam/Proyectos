import { body } from 'express-validator'

export const recommendationValidation = [
    body('message')
        .trim()
        .notEmpty().withMessage('El mensaje es obligatorio')
        .isLength({ min: 3, max: 500 }).withMessage('El mensaje debe tener entre 3 y 500 caracteres')
]

export const budgetAdvisorValidation = [
    body('message')
        .trim()
        .notEmpty().withMessage('El mensaje es obligatorio')
        .isLength({ min: 3, max: 500 }).withMessage('El mensaje debe tener entre 3 y 500 caracteres'),

    body('budget')
        .notEmpty().withMessage('El presupuesto es obligatorio')
        .isFloat({ min: 1 }).withMessage('El presupuesto debe ser un número mayor que 0')
]

export const compareProductsValidation = [
    body('firstProductId')
        .notEmpty().withMessage('El primer producto es obligatorio')
        .isInt({ min: 1 }).withMessage('El primer producto debe ser un id válido'),

    body('secondProductId')
        .notEmpty().withMessage('El segundo producto es obligatorio')
        .isInt({ min: 1 }).withMessage('El segundo producto debe ser un id válido')
]

export const productDescriptionValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del producto es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('La categoría no puede superar los 100 caracteres'),

    body('features')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Las características no pueden superar los 500 caracteres')
]