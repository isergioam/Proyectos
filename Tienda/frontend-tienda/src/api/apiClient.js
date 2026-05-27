const API_URL = import.meta.env.VITE_API_URL

export const getAuthToken = () => {
    return localStorage.getItem('token')
}

export const setAuthToken = (token) => {
    localStorage.setItem('token', token)
}

export const removeAuthToken = () => {
    localStorage.removeItem('token')
}

export const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken()

    const isFormData = options.body instanceof FormData

    const headers = {
        ...options.headers
    }

    if (!isFormData) {
        headers['Content-Type'] = 'application/json'
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    })

    const contentType = response.headers.get('content-type')

    let data = null

    if (contentType && contentType.includes('application/json')) {
        data = await response.json()
    }

    if (!response.ok) {
        const message = data?.message || 'Error en la petición a la API'
        throw new Error(message)
    }

    return data
}