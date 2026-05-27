import { Router } from 'express'
import { uploadDocumentFile } from '../config/multer.config.js'
import {
    createDocument,
    deleteDocument,
    getAllDocumentsAdmin,
    getMyDocuments,
    getPublicDocumentById,
    getPublicDocuments,
    updateDocument
} from '../controllers/documents.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { allowRoles } from '../middlewares/role.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import {
    createDocumentValidation,
    documentIdValidation,
    documentsQueryValidation,
    updateDocumentValidation
} from '../validations/documents.validation.js'

const router = Router()

router.get('/documents', documentsQueryValidation, validateRequest, getPublicDocuments)
router.get('/documents/my-documents', authMiddleware, getMyDocuments)
router.get('/documents/admin/all', authMiddleware, allowRoles('admin'), getAllDocumentsAdmin)
router.get('/documents/:id', documentIdValidation, validateRequest, getPublicDocumentById)

router.post(
    '/documents',
    authMiddleware,
    uploadDocumentFile.single('file'),
    createDocumentValidation,
    validateRequest,
    createDocument
)

router.put(
    '/documents/:id',
    authMiddleware,
    documentIdValidation,
    updateDocumentValidation,
    validateRequest,
    updateDocument
)

router.delete(
    '/documents/:id',
    authMiddleware,
    documentIdValidation,
    validateRequest,
    deleteDocument
)

export default router