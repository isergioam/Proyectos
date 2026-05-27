import { apiRequest } from '../api/apiClient.js'

export const registerUser = async (userData) => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })
}

export const loginUser = async (credentials) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
}

export const getUserProfile = async () => {
    return apiRequest('/auth/profile')
}