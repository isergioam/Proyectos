import { apiRequest } from '../api/apiClient.js'

export const getProducts = async (filters = {}) => {
    const params = new URLSearchParams()

    if (filters.page) {
        params.append('page', filters.page)
    }

    if (filters.limit) {
        params.append('limit', filters.limit)
    }

    if (filters.search) {
        params.append('search', filters.search)
    }

    if (filters.minPrice) {
        params.append('minPrice', filters.minPrice)
    }

    if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice)
    }

    if (filters.inStock) {
        params.append('inStock', filters.inStock)
    }

    const queryString = params.toString()
    const endpoint = queryString ? `/products?${queryString}` : '/products'

    return apiRequest(endpoint)
}

export const getProductById = async (id) => {
    return apiRequest(`/products/${id}`)
}

export const createProduct = async (productData) => {
    return apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    })
}

export const updateProduct = async (id, productData) => {
    return apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    })
}

export const deleteProduct = async (id) => {
    return apiRequest(`/products/${id}`, {
        method: 'DELETE'
    })
}

export const uploadProductImage = async (id, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    return apiRequest(`/products/${id}/image`, {
        method: 'PATCH',
        body: formData
    })
}