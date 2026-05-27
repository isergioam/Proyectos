import {
    findAllCategories,
    findCategoryById,
    insertCategory,
    modifyCategory,
    removeCategory
} from '../services/categories.service.js'

export const getCategories = async (req, res, next) => {
    try {
        const categories = await findAllCategories()
        res.json({ data: categories })
    } catch (error) {
        next(error)
    }
}

export const getCategoryById = async (req, res, next) => {
    try {
        const category = await findCategoryById(req.params.id)

        if (!category) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            })
        }

        res.json(category)
    } catch (error) {
        next(error)
    }
}

export const createCategory = async (req, res, next) => {
    try {
        const category = await insertCategory(req.body)

        res.status(201).json({
            message: 'Categoría creada correctamente',
            category
        })
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const affectedRows = await modifyCategory(req.params.id, req.body)

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            })
        }

        res.json({ message: 'Categoría actualizada correctamente' })
    } catch (error) {
        next(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const affectedRows = await removeCategory(req.params.id)

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            })
        }

        res.json({ message: 'Categoría eliminada correctamente' })
    } catch (error) {
        next(error)
    }
}