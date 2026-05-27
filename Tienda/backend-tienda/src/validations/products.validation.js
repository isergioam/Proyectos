import { body, param, query } from 'express-validator'

export const productIdValidation = [
    param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')
]

export const productsQueryValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser mayor que 0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice debe ser mayor o igual que 0'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice debe ser mayor o igual que 0'),
    query('inStock').optional().isBoolean().withMessage('inStock debe ser true o false')
]

export const createProductValidation = [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('description').optional().trim(),
    body('price').notEmpty().withMessage('El precio es obligatorio').isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor que 0'),
    body('stock').notEmpty().withMessage('El stock es obligatorio').isInt({ min: 0 }).withMessage('El stock debe ser mayor o igual que 0'),
    body('categoryId').optional().isInt({ min: 1 }).withMessage('categoryId debe ser un entero positivo')
]