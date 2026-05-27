import { body, param } from 'express-validator'

export const categoryIdValidation = [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
]

export const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre de la categoría es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres')
]