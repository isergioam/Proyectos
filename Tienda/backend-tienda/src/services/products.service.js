import { prisma } from '../config/prisma.js'

export const findProductsWithFilters = async ({ search, minPrice, maxPrice, inStock, limit, offset }) => {
    const where = {}

    if (search) {
        where.name = {
            contains: search
        }
    }

    if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) {
            where.price.gte = Number(minPrice)
        }
        if (maxPrice) {
            where.price.lte = Number(maxPrice)
        }
    }

    if (inStock === 'true' || inStock === true) {
        where.stock = {
            gt: 0
        }
    }

    const products = await prisma.products.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
            created_at: 'desc'
        },
        include: {
            categories: true
        }
    })

    return products.map(product => {
        const { categories, ...rest } = product
        return {
            ...rest,
            category: categories ? categories.name : null
        }
    })
}

export const countProductsWithFilters = async ({ search, minPrice, maxPrice, inStock }) => {
    const where = {}

    if (search) {
        where.name = {
            contains: search
        }
    }

    if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) {
            where.price.gte = Number(minPrice)
        }
        if (maxPrice) {
            where.price.lte = Number(maxPrice)
        }
    }

    if (inStock === 'true' || inStock === true) {
        where.stock = {
            gt: 0
        }
    }

    return prisma.products.count({
        where
    })
}

export const findProductById = async (id) => {
    const product = await prisma.products.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            categories: true
        }
    })

    if (!product) return null

    const { categories, ...rest } = product
    return {
        ...rest,
        category: categories ? categories.name : null
    }
}

export const insertProduct = async (data) => {
    return prisma.products.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category_id: data.category_id || data.categoryId
        }
    })
}

export const modifyProduct = async (id, data) => {
    const result = await prisma.products.update({
        where: {
            id: Number(id)
        },
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category_id: data.category_id || data.categoryId
        }
    })
    return result ? 1 : 0
}

export const removeProduct = async (id) => {
    const result = await prisma.products.delete({
        where: {
            id: Number(id)
        }
    })
    return result ? 1 : 0
}

export const updateProductImage = async (id, image) => {
    const result = await prisma.products.update({
        where: {
            id: Number(id)
        },
        data: {
            image: image
        }
    })
    return result ? 1 : 0
}