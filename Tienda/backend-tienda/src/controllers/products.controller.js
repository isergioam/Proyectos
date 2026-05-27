import {
    countProductsWithFilters,
    findProductById,
    findProductsWithFilters,
    insertProduct,
    modifyProduct,
    removeProduct,
    updateProductImage
} from '../services/products.service.js'

export const getProducts = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const offset = (page - 1) * limit

        const filters = {
            search: req.query.search,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            inStock: req.query.inStock,
            limit,
            offset
        }

        const [products, total] = await Promise.all([
            findProductsWithFilters(filters),
            countProductsWithFilters(filters)
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
            data: products
        })
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const product = await findProductById(req.params.id)

        if (!product) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.json(product)
    } catch (error) {
        next(error)
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const product = await insertProduct(req.body)

        res.status(201).json({
            message: 'Producto creado correctamente',
            product
        })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const affectedRows = await modifyProduct(req.params.id, req.body)

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.json({
            message: 'Producto actualizado correctamente'
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const affectedRows = await removeProduct(req.params.id)

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.json({
            message: 'Producto eliminado correctamente'
        })
    } catch (error) {
        next(error)
    }
}

export const uploadProductImageController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'La imagen es obligatoria'
            })
        }

        const affectedRows = await updateProductImage(req.params.id, req.file.filename)

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.json({
            message: 'Imagen subida correctamente',
            image: req.file.filename,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
        })
    } catch (error) {
        next(error)
    }
}