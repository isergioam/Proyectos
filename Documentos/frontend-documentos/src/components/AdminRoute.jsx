import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingMessage } from './LoadingMessage'

export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth()

    if (loading) {
        return <LoadingMessage text='Comprobando permisos...' />
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    if (!isAdmin) {
        return <Navigate to='/' replace />
    }

    return children
}