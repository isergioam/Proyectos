import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingMessage } from './LoadingMessage'

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <LoadingMessage text='Comprobando sesión...' />
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    return children
}