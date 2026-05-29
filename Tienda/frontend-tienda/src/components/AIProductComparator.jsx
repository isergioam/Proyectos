import { useEffect, useState } from 'react'
import {
    compareProductsWithAI,
    getProductsForAISelector
} from '../services/aiService'

export const AIProductComparator = () => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({
        firstProductId: '',
        secondProductId: ''
    })
    const [comparison, setComparison] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProductsForAISelector()
                setProducts(Array.isArray(data) ? data : data.data || [])
            } catch (error) {
                setError(error.message)
            } finally {
                setLoadingProducts(false)
            }
        }

        loadProducts()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError('')
            setComparison('')

            const data = await compareProductsWithAI({
                firstProductId: Number(formData.firstProductId),
                secondProductId: Number(formData.secondProductId)
            })

            setComparison(data.comparison)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='ai-tool-card'>
            <header className='ai-tool-header'>
                <span className='ai-tool-kicker'>Herramienta 3</span>
                <h2>Comparador inteligente</h2>
                <p>Selecciona dos productos y la IA explicará sus diferencias.</p>
            </header>

            {loadingProducts ? (
                <p className='ai-muted'>Cargando productos...</p>
            ) : (
                <form className='ai-form' onSubmit={handleSubmit}>
                    <div className='ai-form-grid'>
                        <div className='ai-form-group'>
                            <label htmlFor='firstProductId'>Primer producto</label>
                            <select
                                id='firstProductId'
                                name='firstProductId'
                                value={formData.firstProductId}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Selecciona un producto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='ai-form-group'>
                            <label htmlFor='secondProductId'>Segundo producto</label>
                            <select
                                id='secondProductId'
                                name='secondProductId'
                                value={formData.secondProductId}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Selecciona un producto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type='submit' disabled={loading}>
                        {loading ? 'Comparando...' : 'Comparar productos'}
                    </button>
                </form>
            )}

            {error && <p className='ai-error'>{error}</p>}
            {comparison && <div className='ai-answer'>{comparison}</div>}
        </section>
    )
}