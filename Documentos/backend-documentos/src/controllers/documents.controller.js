import {
    countPublicDocumentsWithFilters,
    findAllDocumentsForAdmin,
    findDocumentById,
    findDocumentsByUser,
    findPublicDocumentsWithFilters,
    insertDocument,
    modifyDocument,
    removeDocument
} from '../services/documents.service.js'

const canManageDocument = (document, user) => {
    return document.user_id === user.id || user.role === 'admin'
}

export const getPublicDocuments = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const offset = (page - 1) * limit

        const filters = {
            search: req.query.search,
            type: req.query.type,
            limit,
            offset
        }

        const [documents, total] = await Promise.all([
            findPublicDocumentsWithFilters(filters),
            countPublicDocumentsWithFilters(filters)
        ])

        const totalPages = Math.ceil(total / limit)

        res.json({
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            },
            data: documents
        })
    } catch (error) {
        next(error)
    }
}

export const getPublicDocumentById = async (req, res, next) => {
    try {
        const document = await findDocumentById(req.params.id)

        if (!document || !document.is_public) {
            return res.status(404).json({
                message: 'Documento no encontrado'
            })
        }

        res.json(document)
    } catch (error) {
        next(error)
    }
}

export const getMyDocuments = async (req, res, next) => {
    try {
        const documents = await findDocumentsByUser(req.user.id)
        res.json({ data: documents })
    } catch (error) {
        next(error)
    }
}

export const getAllDocumentsAdmin = async (req, res, next) => {
    try {
        const documents = await findAllDocumentsForAdmin()
        res.json({ data: documents })
    } catch (error) {
        next(error)
    }
}

export const createDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'El archivo del documento es obligatorio'
            })
        }

        const document = await insertDocument({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            fileName: req.file.filename,
            isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
            userId: req.user.id
        })

        res.status(201).json({
            message: 'Documento creado correctamente',
            document
        })
    } catch (error) {
        next(error)
    }
}

export const updateDocument = async (req, res, next) => {
    try {
        const document = await findDocumentById(req.params.id)

        if (!document) {
            return res.status(404).json({
                message: 'Documento no encontrado'
            })
        }

        if (!canManageDocument(document, req.user)) {
            return res.status(403).json({
                message: 'No tienes permisos para editar este documento'
            })
        }

        await modifyDocument(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            isPublic: req.body.isPublic
        })

        res.json({
            message: 'Documento actualizado correctamente'
        })
    } catch (error) {
        next(error)
    }
}

export const deleteDocument = async (req, res, next) => {
    try {
        const document = await findDocumentById(req.params.id)

        if (!document) {
            return res.status(404).json({
                message: 'Documento no encontrado'
            })
        }

        if (!canManageDocument(document, req.user)) {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar este documento'
            })
        }

        await removeDocument(req.params.id)

        res.json({
            message: 'Documento eliminado correctamente'
        })
    } catch (error) {
        next(error)
    }
}