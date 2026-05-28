import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProfilePage() {
    const { user, isAdmin, logout } = useAuth()

    return (
        <section>
            <h1 className="page-title">Mi perfil</h1>
            <p className="page-subtitle">
                Datos del usuario autenticado en la aplicación.
            </p>

            <div className="card profile-card">
                <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div className="profile-info">
                    <h2>{user?.name}</h2>

                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>

                    <p>
                        <strong>Rol:</strong> {user?.role}
                    </p>

                    <p>
                        <strong>ID de usuario:</strong> {user?.id}
                    </p>
                </div>
            </div>

            <div className="card profile-actions">
                <h2>Acciones disponibles</h2>

                <div className="actions">
                    <Link to="/mis-documentos" className="btn btn-outline">
                        Ver mis documentos
                    </Link>

                    {isAdmin && (
                        <Link to="/admin" className="btn btn-outline">
                            Ir al panel admin
                        </Link>
                    )}

                    <button type="button" className="btn btn-danger" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ProfilePage