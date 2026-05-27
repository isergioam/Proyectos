import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../components/ProductForm.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingMessage from '../components/LoadingMessage.jsx'
import { getProductById, updateProduct } from '../services/productsService.js'
import { getCategories } from '../services/categoriesService.js'

function AdminProductEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: ''
    })

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadInitialData()
    }, [id])

    const loadInitialData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [product, categoriesResponse] = await Promise.all([
                getProductById(id),
                getCategories()
            ])

            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                categoryId: product.category_id || ''
            })

            setCategories(categoriesResponse.data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setSaving(true)
            setError(null)

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                categoryId: formData.categoryId ? Number(formData.categoryId) : null
            }

            await updateProduct(id, productData)
            navigate('/admin/productos')
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <LoadingMessage text="Cargando producto..." />
    }

    return (
        <section>
            <Link to="/admin/productos" className="btn btn-secondary detail-back-button">
                Volver a productos
            </Link>

            <h1 className="page-title">Editar producto</h1>
            <p className="page-subtitle">
                Modifica los datos principales del producto seleccionado.
            </p>

            <ErrorMessage message={error} />

            <ProductForm
                formData={formData}
                categories={categories}
                submitText={saving ? 'Actualizando producto...' : 'Actualizar producto'}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </section>
    )
}

export default AdminProductEditPage