import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingMessage from '../components/LoadingMessage.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import {
    deleteProduct,
    getProducts,
    uploadProductImage
} from '../services/productsService.js'

function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await getProducts({ limit: 100 })
            setProducts(response.data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar este producto?')

        if (!confirmDelete) {
            return
        }

        try {
            setError(null)
            setSuccess(null)

            const response = await deleteProduct(id)
            setSuccess(response.message || 'Producto eliminado correctamente')
            loadProducts()
        } catch (error) {
            setError(error.message)
        }
    }

    const handleImageChange = async (id, event) => {
        const file = event.target.files[0]

        if (!file) {
            return
        }

        try {
            setError(null)
            setSuccess(null)

            const response = await uploadProductImage(id, file)
            setSuccess(response.message || 'Imagen subida correctamente')
            loadProducts()
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <LoadingMessage text="Cargando productos de administración..." />
    }

    return (
        <section>
            <div className="admin-header">
                <div>
                    <h1 className="page-title">Gestión de productos</h1>
                    <p className="page-subtitle">
                        Crea, edita, elimina productos y sube imágenes.
                    </p>
                </div>

                <Link to="/admin/productos/nuevo" className="btn">
                    Crear producto
                </Link>
            </div>

            <ErrorMessage message={error} />

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {products.length === 0 ? (
                <div className="card">
                    <p>No hay productos registrados.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category || 'Sin categoría'}</td>
                                    <td>{Number(product.price).toFixed(2)} €</td>
                                    <td>{product.stock}</td>
                                    <td>{product.image ? 'Sí' : 'No'}</td>
                                    <td>
                                        <div className="actions">
                                            <Link
                                                to={`/admin/productos/${product.id}`}
                                                className="btn btn-outline"
                                            >
                                                Editar
                                            </Link>

                                            <label className="btn btn-secondary file-button">
                                                Imagen
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={(event) => handleImageChange(product.id, event)}
                                                />
                                            </label>

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default AdminProductsPage