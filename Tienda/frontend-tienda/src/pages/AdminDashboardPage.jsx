import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function AdminDashboardPage() {
    const { user } = useAuth()

    return (
        <section>
            <h1 className="page-title">Panel de administración</h1>
            <p className="page-subtitle">
                Zona privada para gestionar productos, categorías e imágenes de la tienda.
            </p>

            <div className="card admin-welcome">
                <h2>Bienvenido, {user?.name}</h2>
                <p>
                    Has accedido con un usuario administrador. Desde aquí puedes gestionar los datos principales de la tienda.
                </p>
            </div>

            <div className="admin-grid">
                <article className="card">
                    <h2>Productos</h2>
                    <p>
                        Crea, edita, elimina productos y sube imágenes asociadas a cada producto.
                    </p>
                    <Link to="/admin/productos" className="btn btn-outline">
                        Gestionar productos
                    </Link>
                </article>

                <article className="card">
                    <h2>Categorías</h2>
                    <p>
                        Crea, edita y elimina las categorías usadas para clasificar los productos.
                    </p>
                    <Link to="/admin/categorias" className="btn btn-outline">
                        Gestionar categorías
                    </Link>
                </article>

                <article className="card">
                    <h2>Catálogo público</h2>
                    <p>
                        Revisa cómo ven los usuarios el listado público de productos.
                    </p>
                    <Link to="/productos" className="btn btn-outline">
                        Ver catálogo
                    </Link>
                </article>
            </div>
        </section>
    )
}

export default AdminDashboardPage