import { Router } from 'express'
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from '../controllers/categories.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { allowRoles } from '../middlewares/role.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import {
    categoryIdValidation,
    createCategoryValidation
} from '../validations/categories.validation.js'

const router = Router()

router.get('/categories', getCategories)
router.get('/categories/:id', categoryIdValidation, validateRequest, getCategoryById)
router.post('/categories', authMiddleware, allowRoles('admin'), createCategoryValidation, validateRequest, createCategory)
router.put('/categories/:id', authMiddleware, allowRoles('admin'), categoryIdValidation, createCategoryValidation, validateRequest, updateCategory)
router.delete('/categories/:id', authMiddleware, allowRoles('admin'), categoryIdValidation, validateRequest, deleteCategory)

export default router