import { Router } from 'express'
import {
    adviseByBudget,
    compareProducts,
    createProductDescription,
    recommendProducts
} from '../controllers/ai.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { allowRoles } from '../middlewares/role.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import {
    budgetAdvisorValidation,
    compareProductsValidation,
    productDescriptionValidation,
    recommendationValidation
} from '../validations/ai.validation.js'

const router = Router()

router.post(
    '/ai/recommendations',
    recommendationValidation,
    validateRequest,
    recommendProducts
)

router.post(
    '/ai/budget-advisor',
    budgetAdvisorValidation,
    validateRequest,
    adviseByBudget
)

router.post(
    '/ai/compare-products',
    compareProductsValidation,
    validateRequest,
    compareProducts
)

router.post(
    '/ai/product-description',
    authMiddleware,
    allowRoles('admin'),
    productDescriptionValidation,
    validateRequest,
    createProductDescription
)

export default router