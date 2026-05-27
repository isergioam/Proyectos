import { createContext, useContext, useEffect, useState } from 'react'
import { getAuthToken, removeAuthToken, setAuthToken } from '../api/apiClient.js'
import { getUserProfile, loginUser } from '../services/authService.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        const token = getAuthToken()

        if (!token) {
            setLoading(false)
            return
        }

        try {
            const profile = await getUserProfile()
            setUser(profile.user || profile)
        } catch (error) {
            removeAuthToken()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        const response = await loginUser(credentials)

        setAuthToken(response.token)
        setUser(response.user)

        return response
    }

    const logout = () => {
        removeAuthToken()
        setUser(null)
    }

    const isAuthenticated = Boolean(user)
    const isAdmin = user?.role === 'admin'

    const value = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        checkAuthStatus
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }

    return context
}