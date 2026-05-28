import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function HomePage() {
    const { isAuthenticated, isAdmin, user } = useAuth()

    return (
        <section>
            <div className="hero card">
                <div>
                    <h1 className="page-title">API Documentos con React y Node</h1>

                    <p className="page-subtitle">
                        Aplicación frontend desarrollada con React para consumir una API REST creada con Node, Express y MySQL.
                    </p>

                    <div className="hero-actions">
                        <Link to="/documentos" className="btn">
                            Ver documentos
                        </Link>

                        {!isAuthenticated && (
                            <Link to="/login" className="btn btn-secondary">
                                Iniciar sesión
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className="btn btn-outline">
                                Ir al panel admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {isAuthenticated && (
                <div className="card home-welcome">
                    <h2>Bienvenido, {user?.name}</h2>
                    <p>
                        Has iniciado sesión correctamente. Desde el menú superior puedes acceder a tu perfil.
                    </p>

                    {isAdmin && (
                        <p>
                            Además, tu usuario tiene rol de administrador, así que puedes gestionar productos y categorías.
                        </p>
                    )}
                </div>
            )}

            <div className="home-grid">
                <article className="card">
                    <h2>Catálogo público</h2>
                    <p>
                        Cualquier usuario puede consultar productos, ver su precio, revisar el stock y acceder al detalle.
                    </p>
                    <Link to="/productos" className="btn btn-outline">
                        Explorar catálogo
                    </Link>
                </article>

                <article className="card">
                    <h2>Usuarios autenticados</h2>
                    <p>
                        Los usuarios registrados pueden iniciar sesión y consultar su perfil usando un token JWT.
                    </p>

                    {!isAuthenticated ? (
                        <Link to="/register" className="btn btn-outline">
                            Crear cuenta
                        </Link>
                    ) : (
                        <Link to="/perfil" className="btn btn-outline">
                            Ver perfil
                        </Link>
                    )}
                </article>

                <article className="card">
                    <h2>Administración</h2>
                    <p>
                        Los administradores pueden crear, editar y eliminar productos, gestionar categorías y subir imágenes.
                    </p>

                    {isAdmin ? (
                        <Link to="/admin" className="btn btn-outline">
                            Acceder al admin
                        </Link>
                    ) : (
                        <p className="muted-text">
                            Esta zona está reservada para usuarios con rol administrador.
                        </p>
                    )}
                </article>
            </div>
        </section>
    )
}

export default HomePage