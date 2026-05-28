import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    API Documentos
                </Link>

                <nav className="navbar-links">
                    <NavLink to="/" className="nav-link">
                        Inicio
                    </NavLink>

                    <NavLink to="/documentos" className="nav-link">
                        Documentos
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink to="/mis-documentos" className="nav-link">
                            Mis documentos
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink to="/admin" className="nav-link">
                            Admin
                        </NavLink>
                    )}

                    {!isAuthenticated && (
                        <>
                            <NavLink to="/login" className="nav-link">
                                Login
                            </NavLink>

                            <NavLink to="/register" className="nav-link">
                                Registro
                            </NavLink>
                        </>
                    )}

                    {isAuthenticated && (
                        <button type="button" className="nav-button" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    )}
                </nav>
            </div>

            {isAuthenticated && (
                <div className="navbar-user">
                    Sesión iniciada como <strong>{user?.name}</strong>
                </div>
            )}
        </header>
    )
}

export default Navbar