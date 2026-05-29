import {
    generateBudgetAdvice,
    generateProductComparison,
    generateProductDescription,
    generateRecommendation
} from '../services/ai.service.js'
import {
    getAvailableProductsForAI,
    getProductByIdForAI,
    getProductsByBudgetForAI
} from '../services/aiCatalog.service.js'

export const recommendProducts = async (req, res, next) => {
    try {
        const { message } = req.body
        const products = await getAvailableProductsForAI()

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No hay productos disponibles para recomendar'
            })
        }

        const answer = await generateRecommendation({ message, products })

        res.json({
            answer,
            productsUsed: products.length
        })
    } catch (error) {
        next(error)
    }
}

export const adviseByBudget = async (req, res, next) => {
    try {
        const { message, budget } = req.body
        const products = await getProductsByBudgetForAI(budget)

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No hay productos disponibles dentro de ese presupuesto'
            })
        }

        const answer = await generateBudgetAdvice({ message, budget, products })

        res.json({
            answer,
            productsUsed: products.length
        })
    } catch (error) {
        next(error)
    }
}

export const compareProducts = async (req, res, next) => {
    try {
        const { firstProductId, secondProductId } = req.body

        if (Number(firstProductId) === Number(secondProductId)) {
            return res.status(400).json({
                message: 'Debes seleccionar dos productos diferentes'
            })
        }

        const firstProduct = await getProductByIdForAI(firstProductId)
        const secondProduct = await getProductByIdForAI(secondProductId)

        if (!firstProduct || !secondProduct) {
            return res.status(404).json({
                message: 'Uno de los productos seleccionados no existe'
            })
        }

        const comparison = await generateProductComparison({ firstProduct, secondProduct })

        res.json({ comparison })
    } catch (error) {
        next(error)
    }
}

export const createProductDescription = async (req, res, next) => {
    try {
        const { name, category, features } = req.body
        const description = await generateProductDescription({ name, category, features })

        res.json({ description })
    } catch (error) {
        next(error)
    }
}