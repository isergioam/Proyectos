import { pool } from '../database/connection.js'
import { prisma } from '../config/prisma.js'

export const findProductsWithFilters = async ({ search, minPrice, maxPrice, inStock, limit, offset }) => {
    const conditions = []
    const values = []

    if (search) {
        conditions.push('p.name LIKE ?')
        values.push(`%${search}%`)
    }

    if (minPrice) {
        conditions.push('p.price >= ?')
        values.push(Number(minPrice))
    }

    if (maxPrice) {
        conditions.push('p.price <= ?')
        values.push(Number(maxPrice))
    }

    if (inStock === 'true') {
        conditions.push('p.stock > 0')
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.query(
        `SELECT p.*, c.name AS category
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         ${where}
         ORDER BY p.created_at DESC
         LIMIT ? OFFSET ?`,
        [...values, limit, offset]
    )

    return rows
}

export const countProductsWithFilters = async ({ search, minPrice, maxPrice, inStock }) => {
    const conditions = []
    const values = []

    if (search) {
        conditions.push('name LIKE ?')
        values.push(`%${search}%`)
    }

    if (minPrice) {
        conditions.push('price >= ?')
        values.push(Number(minPrice))
    }

    if (maxPrice) {
        conditions.push('price <= ?')
        values.push(Number(maxPrice))
    }

    if (inStock === 'true') {
        conditions.push('stock > 0')
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.query(
        `SELECT COUNT(*) AS total FROM products ${where}`,
        values
    )

    return rows[0].total
}
/*
export const findProductById = async (id) => {
    const [rows] = await pool.query(
        `SELECT p.*, c.name AS category
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`,
        [id]
    )

    return rows[0]
}
*/
export const insertProduct = async ({ name, description, price, stock, categoryId }) => {
    const [result] = await pool.query(
        `INSERT INTO products(name, description, price, stock, category_id)
         VALUES (?, ?, ?, ?, ?)`,
        [name, description, price, stock, categoryId]
    )

    return {
        id: result.insertId,
        name,
        description,
        price,
        stock,
        categoryId
    }
}

export const modifyProduct = async (id, { name, description, price, stock, categoryId }) => {
    const [result] = await pool.query(
        `UPDATE products
         SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
         WHERE id = ?`,
        [name, description, price, stock, categoryId, id]
    )

    return result.affectedRows
}

export const removeProduct = async (id) => {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id])
    return result.affectedRows
}

export const updateProductImage = async (id, image) => {
    const [result] = await pool.query(
        'UPDATE products SET image = ? WHERE id = ?',
        [image, id]
    )

    return result.affectedRows
}
/* CONSULTAS CON PRISMA */
export const createProduct = async (data) => {
    return prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock
        }
    })
}

export const findAllProducts = async () => {
    return prisma.product.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            id: 'desc'
        }
    })
}

export const findProductById = async (id) => {
    return prisma.product.findUnique({
        where: {
            id: Number(id)
        }
    })
}

export const updateProduct = async ({ id, data }) => {
    return prisma.product.update({
        where: {
            id: Number(id)
        },
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock
        }
    })
}
/*
export const hardDeleteProduct = async (id) => {
    return prisma.product.delete({
        where: {
            id: Number(id)
        }
    })
}*/

export const deleteProduct = async (id) => {
    return prisma.product.update({
        where: {
            id: Number(id)
        },
        data: {
            isActive: false
        }
    })
}