import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingMessage from '../components/LoadingMessage.jsx'
import { createProduct } from '../services/productsService.js'
import { getCategories } from '../services/categoriesService.js'

function AdminProductCreatePage() {
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
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await getCategories()
            setCategories(response.data)
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

            await createProduct(productData)
            navigate('/admin/productos')
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <LoadingMessage text="Cargando categorías..." />
    }

    return (
        <section>
            <Link to="/admin/productos" className="btn btn-secondary detail-back-button">
                Volver a productos
            </Link>

            <h1 className="page-title">Crear producto</h1>
            <p className="page-subtitle">
                Completa el formulario para añadir un nuevo producto a la tienda.
            </p>

            <ErrorMessage message={error} />

            <ProductForm
                formData={formData}
                categories={categories}
                submitText={saving ? 'Creando producto...' : 'Crear producto'}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </section>
    )
}

export default AdminProductCreatePage