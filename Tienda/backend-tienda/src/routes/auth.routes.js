import { Router } from 'express'
import { login, profile, register } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { loginValidation, registerValidation } from '../validations/auth.validation.js'

const router = Router()

router.post('/auth/register', registerValidation, validateRequest, register)
router.post('/auth/login', loginValidation, validateRequest, login)
router.get('/auth/profile', authMiddleware, profile)

export default router
