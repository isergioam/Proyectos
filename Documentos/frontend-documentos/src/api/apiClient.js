const API_URL = import.meta.env.VITE_API_URL

const getToken = () => {
    return localStorage.getItem('token')
}

export const apiRequest = async (endpoint, options = {}) => {
    const { auth = false, body, isFormData = false, ...customOptions } = options

    const headers = new Headers(customOptions.headers)

    if (!isFormData && body) {
        headers.set('Content-Type', 'application/json')
    }

    if (auth) {
        const token = getToken()

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...customOptions,
        headers,
        body: body
            ? isFormData
                ? body
                : JSON.stringify(body)
            : undefined
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data?.message || 'Error al consumir la API'
        throw new Error(message)
    }

    return data
}