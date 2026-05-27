import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
    uploadProductImageController
} from '../controllers/products.controller.js'
import { uploadProductImage } from '../config/multer.config.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { allowRoles } from '../middlewares/role.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import {
    createProductValidation,
    productIdValidation,
    productsQueryValidation
} from '../validations/products.validation.js'

const router = Router()

router.get('/products', productsQueryValidation, validateRequest, getProducts)
router.get('/products/:id', productIdValidation, validateRequest, getProductById)
router.post('/products', authMiddleware, allowRoles('admin'), createProductValidation, validateRequest, createProduct)
router.put('/products/:id', authMiddleware, allowRoles('admin'), productIdValidation, createProductValidation, validateRequest, updateProduct)
router.delete('/products/:id', authMiddleware, allowRoles('admin'), productIdValidation, validateRequest, deleteProduct)
router.patch('/products/:id/image', authMiddleware, allowRoles('admin'), productIdValidation, validateRequest, uploadProductImage.single('image'), uploadProductImageController)

export default router