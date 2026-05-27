import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingMessage from '../components/LoadingMessage.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { getProductById } from '../services/productsService.js'

function ProductDetailPage() {
    const { id } = useParams()
    const uploadsUrl = import.meta.env.VITE_UPLOADS_URL

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadProduct()
    }, [id])

    const loadProduct = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await getProductById(id)
            setProduct(response)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingMessage text="Cargando detalle del producto..." />
    }

    if (error) {
        return (
            <section>
                <ErrorMessage message={error} />
                <Link to="/productos" className="btn btn-secondary">
                    Volver al catálogo
                </Link>
            </section>
        )
    }

    if (!product) {
        return (
            <section className="card">
                <p>Producto no encontrado.</p>
                <Link to="/productos" className="btn btn-secondary">
                    Volver al catálogo
                </Link>
            </section>
        )
    }

    const imageUrl = product.image
        ? `${uploadsUrl}/${product.image}`
        : 'https://placehold.co/900x500?text=Sin+imagen'

    return (
        <section>
            <Link to="/productos" className="btn btn-secondary detail-back-button">
                Volver al catálogo
            </Link>

            <article className="card product-detail">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-detail-image"
                />

                <div className="product-detail-content">
                    <p className="product-card-category">
                        {product.category || 'Sin categoría'}
                    </p>

                    <h1 className="page-title">
                        {product.name}
                    </h1>

                    <p className="product-detail-price">
                        {Number(product.price).toFixed(2)} €
                    </p>

                    <p className="product-detail-description">
                        {product.description || 'Este producto no tiene descripción.'}
                    </p>

                    <div className="product-detail-info">
                        <p>
                            <strong>Stock:</strong> {product.stock}
                        </p>

                        <p>
                            <strong>ID del producto:</strong> {product.id}
                        </p>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default ProductDetailPage