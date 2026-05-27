import { Link } from 'react-router-dom'

function ProductCard({ product }) {
    const uploadsUrl = import.meta.env.VITE_UPLOADS_URL
    const imageUrl = product.image
        ? `${uploadsUrl}/${product.image}`
        : 'https://placehold.co/400x300?text=Sin+imagen'

    return (
        <article className="card product-card">
            <Link to={`/productos/${product.id}`} className="product-card-image-link">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-card-image"
                />
            </Link>

            <div className="product-card-body">
                <span className="product-card-category">
                    {product.category || 'Sin categoría'}
                </span>

                <h3 className="product-card-title">
                    <Link to={`/productos/${product.id}`}>{product.name}</Link>
                </h3>

                <p className="product-card-description">
                    {product.description || 'Sin descripción disponible.'}
                </p>

                <div className="product-card-footer">
                    <span className="product-card-price">
                        {Number(product.price).toFixed(2)} €
                    </span>

                    <span className={`product-card-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                    </span>
                </div>

                <div className="product-card-actions">
                    <Link to={`/productos/${product.id}`} className="btn btn-outline product-card-btn">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default ProductCard
