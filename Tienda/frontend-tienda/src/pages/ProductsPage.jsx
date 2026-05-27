import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import LoadingMessage from '../components/LoadingMessage.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { getProducts } from '../services/productsService.js'

function ProductsPage() {
    const [products, setProducts] = useState([])
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        page: 1,
        limit: 6
    })

    useEffect(() => {
        loadProducts()
    }, [filters.page])

    const loadProducts = async (customFilters = filters) => {
        try {
            setLoading(true)
            setError(null)

            const apiFilters = {
                ...customFilters,
                inStock: customFilters.inStock ? 'true' : ''
            }

            const response = await getProducts(apiFilters)

            setProducts(response.data)
            setMeta(response.meta)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target

        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const newFilters = {
            ...filters,
            page: 1
        }

        setFilters(newFilters)
        loadProducts(newFilters)
    }

    const handleClearFilters = () => {
        const cleanFilters = {
            search: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            page: 1,
            limit: 6
        }

        setFilters(cleanFilters)
        loadProducts(cleanFilters)
    }

    const goToPreviousPage = () => {
        if (!meta?.hasPreviousPage) {
            return
        }

        setFilters({
            ...filters,
            page: filters.page - 1
        })
    }

    const goToNextPage = () => {
        if (!meta?.hasNextPage) {
            return
        }

        setFilters({
            ...filters,
            page: filters.page + 1
        })
    }

    if (loading) {
        return <LoadingMessage text="Cargando productos..." />
    }

    return (
        <section>
            <h1 className="page-title">Productos</h1>
            <p className="page-subtitle">
                Catálogo público de productos obtenido desde la API Node.
            </p>

            <form className="card filters-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="search">Buscar</label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Ejemplo: monitor"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="minPrice">Precio mínimo</label>
                    <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="maxPrice">Precio máximo</label>
                    <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={filters.inStock}
                        onChange={handleChange}
                    />
                    Sólo productos con stock
                </label>

                <div className="actions">
                    <button type="submit" className="btn">
                        Aplicar filtros
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClearFilters}
                    >
                        Limpiar filtros
                    </button>
                </div>
            </form>

            <ErrorMessage message={error} />

            {products.length === 0 ? (
                <div className="card">
                    <p>No se han encontrado productos con los filtros indicados.</p>
                </div>
            ) : (
                <>
                    <div className="products-summary">
                        <p>
                            Productos encontrados: <strong>{meta?.total || products.length}</strong>
                        </p>
                    </div>

                    <div className="grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {meta && (
                        <div className="pagination card">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={goToPreviousPage}
                                disabled={!meta.hasPreviousPage}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {meta.page} de {meta.totalPages}
                            </span>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={goToNextPage}
                                disabled={!meta.hasNextPage}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default ProductsPage