import { apiRequest } from '../api/apiClient'

export const registerUser = (userData) => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: userData
    })
}

export const loginUser = (credentials) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: credentials
    })
}

export const getProfile = () => {
    return apiRequest('/auth/profile', {
        auth: true
    })
}