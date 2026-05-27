import { apiRequest } from '../api/apiClient.js'

export const getCategories = async () => {
    return apiRequest('/categories')
}

export const getCategoryById = async (id) => {
    return apiRequest(`/categories/${id}`)
}

export const createCategory = async (categoryData) => {
    return apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
    })
}

export const updateCategory = async (id, categoryData) => {
    return apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    })
}

export const deleteCategory = async (id) => {
    return apiRequest(`/categories/${id}`, {
        method: 'DELETE'
    })
}