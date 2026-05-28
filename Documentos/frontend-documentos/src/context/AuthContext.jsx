import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, loginUser } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')

    const isAuthenticated = Boolean(user)
    const isAdmin = user?.role === 'admin'

    const loadProfile = async () => {
        try {
            if (!localStorage.getItem('token')) {
                setUser(null)
                return
            }

            const profile = await getProfile()
            setUser(profile.user)
        } catch (error) {
            localStorage.removeItem('token')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        const data = await loginUser(credentials)
        localStorage.setItem('token', data.token)
        await loadProfile()
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    useEffect(() => {
        loadProfile()
    }, [token])

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}