import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminDashboardPage() {
    const { user } = useAuth()

    return (
        <main className='page'>
            <div className='container'>
                <header className='page-header'>
                    <span className='badge'>Panel administrador</span>
                    <h1 className='page-title'>Panel de administración</h1>
                    <p className='page-subtitle'>
                        Desde esta zona podrás gestionar la parte privada de administración de la API de documentos.
                    </p>
                </header>

                <section className='admin-panel'>
                    <article className='card'>
                        <h2>Documentos</h2>
                        <p>
                            Consulta todos los documentos creados por todos los usuarios de la aplicación.
                        </p>

                        <div className='actions'>
                            <Link className='button' to='/admin/documentos'>
                                Ver documentos
                            </Link>
                        </div>
                    </article>

                    <article className='card'>
                        <h2>Administrador actual</h2>
                        <p>
                            Nombre: <strong>{user?.name}</strong>
                        </p>
                        <p>
                            Email: <strong>{user?.email}</strong>
                        </p>
                        <p>
                            Rol: <strong>{user?.role}</strong>
                        </p>
                    </article>

                    <article className='card'>
                        <h2>Permisos activos</h2>
                        <p>
                            Un administrador puede ver, editar y eliminar documentos de cualquier usuario.
                        </p>
                        <p>
                            Estas acciones solo deben estar disponibles para usuarios con rol <strong>admin</strong>.
                        </p>
                    </article>
                </section>
            </div>
        </main>
    )
}

export default AdminDashboardPage
