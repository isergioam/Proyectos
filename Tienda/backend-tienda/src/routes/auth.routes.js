import { Router } from 'express'
import { login, profile, register } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { loginLimiter, passwordResetLimiter } from '../middlewares/rate-limit.middleware.js'
import { loginValidation, registerValidation } from '../validations/auth.validation.js'
import {
    forgotPasswordController,
    resetPasswordController,
    verifyEmailController
} from '../controllers/auth.controller.js'


const router = Router()

router.post('/auth/register', registerValidation, validateRequest, register)
router.post('/auth/login', loginLimiter, loginValidation, validateRequest, login)
router.get('/auth/profile', authMiddleware, profile)

router.post('/auth/forgot-password', passwordResetLimiter, forgotPasswordValidation, validateRequest, forgotPasswordController)
router.post('/auth/reset-password', resetPasswordValidation, validateRequest, resetPasswordController)
router.post('/auth/verify-email', verifyEmailValidation, validateRequest, verifyEmailController)

export default router
