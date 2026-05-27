import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth()

    if (loading) {
        return <p>Comprobando permisos...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return (
            <div className="card">
                <h1 className="page-title">Acceso denegado</h1>
                <p>No tienes permisos para acceder a esta sección.</p>
            </div>
        )
    }

    return children
}

export default AdminRoute