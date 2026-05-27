import { body, param, query } from 'express-validator'

export const documentIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El id debe ser un número entero positivo')
]

export const documentsQueryValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page debe ser mayor que 0'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit debe estar entre 1 y 100'),

    query('search')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('La búsqueda debe tener al menos 2 caracteres'),

    query('type')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El tipo no puede estar vacío')
]

export const createDocumentValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El título debe tener al menos 3 caracteres'),

    body('description')
        .optional()
        .trim(),

    body('type')
        .trim()
        .notEmpty()
        .withMessage('El tipo es obligatorio')
        .isIn(['pdf', 'word', 'image', 'other'])
        .withMessage('El tipo debe ser pdf, word, image u other'),

    body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic debe ser true o false')
]

export const updateDocumentValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El título debe tener al menos 3 caracteres'),

    body('description')
        .optional()
        .trim(),

    body('type')
        .trim()
        .notEmpty()
        .withMessage('El tipo es obligatorio')
        .isIn(['pdf', 'word', 'image', 'other'])
        .withMessage('El tipo debe ser pdf, word, image u other'),

    body('isPublic')
        .isBoolean()
        .withMessage('isPublic debe ser true o false')
]