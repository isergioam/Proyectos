import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryForm from '../components/CategoryForm.jsx'
import LoadingMessage from '../components/LoadingMessage.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory
} from '../services/categoriesService.js'

function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: ''
    })
    const [editingCategory, setEditingCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

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
            setSuccess(null)

            if (editingCategory) {
                const response = await updateCategory(editingCategory.id, formData)
                setSuccess(response.message || 'Categoría actualizada correctamente')
            } else {
                const response = await createCategory(formData)
                setSuccess(response.message || 'Categoría creada correctamente')
            }

            setFormData({ name: '' })
            setEditingCategory(null)
            loadCategories()
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name
        })
        setError(null)
        setSuccess(null)
    }

    const handleCancelEdit = () => {
        setEditingCategory(null)
        setFormData({ name: '' })
        setError(null)
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar esta categoría?')

        if (!confirmDelete) {
            return
        }

        try {
            setError(null)
            setSuccess(null)

            const response = await deleteCategory(id)
            setSuccess(response.message || 'Categoría eliminada correctamente')
            loadCategories()
        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) {
        return <LoadingMessage text="Cargando categorías..." />
    }

    return (
        <section>
            <Link to="/admin" className="btn btn-secondary detail-back-button">
                Volver al panel admin
            </Link>

            <h1 className="page-title">Gestión de categorías</h1>
            <p className="page-subtitle">
                Crea, edita y elimina las categorías de la tienda.
            </p>

            <ErrorMessage message={error} />

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <CategoryForm
                formData={formData}
                submitText={
                    saving
                        ? 'Guardando...'
                        : editingCategory
                            ? 'Actualizar categoría'
                            : 'Crear categoría'
                }
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={editingCategory ? handleCancelEdit : undefined}
            />

            <div className="admin-section">
                <h2>Categorías registradas</h2>

                {categories.length === 0 ? (
                    <div className="card">
                        <p>No hay categorías registradas.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <div className="actions">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(category.id)}
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
            </div>
        </section>
    )
}

export default AdminCategoriesPage