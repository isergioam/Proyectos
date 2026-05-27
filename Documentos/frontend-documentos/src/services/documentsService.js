import { apiRequest } from '../api/apiClient'

const buildQueryString = (filters = {}) => {
    const params = new URLSearchParams()

    if (filters.page) params.set('page', filters.page)
    if (filters.limit) params.set('limit', filters.limit)
    if (filters.search) params.set('search', filters.search)
    if (filters.type) params.set('type', filters.type)

    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
}

export const getPublicDocuments = (filters = {}) => {
    return apiRequest(`/documents${buildQueryString(filters)}`)
}

export const getPublicDocumentById = (id) => {
    return apiRequest(`/documents/${id}`)
}

export const getMyDocuments = () => {
    return apiRequest('/documents/my-documents', {
        auth: true
    })
}

export const getAllDocumentsAdmin = () => {
    return apiRequest('/documents/admin/all', {
        auth: true
    })
}

export const createDocument = (formData) => {
    return apiRequest('/documents', {
        method: 'POST',
        auth: true,
        body: formData,
        isFormData: true
    })
}

export const updateDocument = (id, documentData) => {
    return apiRequest(`/documents/${id}`, {
        method: 'PUT',
        auth: true,
        body: documentData
    })
}

export const deleteDocument = (id) => {
    return apiRequest(`/documents/${id}`, {
        method: 'DELETE',
        auth: true
    })
}