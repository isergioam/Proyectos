import { useEffect, useState } from 'react'
import { createObjeto, deleteObjeto, fetchObjetos } from '../api/objetos.api'
import Container from '../components/Container'
import Toast from '../components/Toast'

function ObjetosPage() {
    const [objetos, setObjetos] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        nombre: '',
        descripcion: ''
    })
    const [toast, setToast] = useState({
        type: 'info',
        message: ''
    })

    async function loadObjetos() {
        try {
            setLoading(true)
            const data = await fetchObjetos()
            setObjetos(data)
        } catch (error) {
            setToast({
                type: 'error',
                message: error.message
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadObjetos()
    }, [])

    function handleChange(event) {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setSubmitting(true)

            await createObjeto({
                nombre: form.nombre,
                descripcion: form.descripcion
            })

            setForm({
                nombre: '',
                descripcion: ''
            })

            setToast({
                type: 'success',
                message: 'Objeto creado correctamente.'
            })

            await loadObjetos()
        } catch (error) {
            setToast({
                type: 'error',
                message: error.message
            })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id, estado) {
        if (estado === 'PRESTADO') {
            setToast({
                type: 'error',
                message: 'No se puede borrar un objeto prestado.'
            })
            return
        }

        const confirmed = window.confirm('¿Seguro que quieres eliminar este objeto?')

        if (!confirmed) {
            return
        }

        try {
            await deleteObjeto(id)

            setToast({
                type: 'success',
                message: 'Objeto eliminado correctamente.'
            })

            await loadObjetos()
        } catch (error) {
            setToast({
                type: 'error',
                message: error.message
            })
        }
    }

    return (
        <Container>
            <div className="page-header">
                <p className="eyebrow">Fase 5</p>
                <h1>Gestión de objetos</h1>
                <p className="lead">
                    Esta pantalla consume la API real para listar, crear y borrar objetos.
                </p>
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ type: 'info', message: '' })}
            />

            <section className="card">
                <h2>Crear nuevo objeto</h2>

                <form className="object-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ejemplo: Taladro"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows="4"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Ejemplo: Taladro negro de batería"
                        />
                    </div>

                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Guardando...' : 'Crear objeto'}
                    </button>
                </form>
            </section>

            <section className="card">
                <h2>Listado de objetos</h2>

                {loading ? (
                    <p>Cargando objetos...</p>
                ) : objetos.length === 0 ? (
                    <p>No hay objetos registrados todavía.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {objetos.map((objeto) => (
                                    <tr key={objeto.id}>
                                        <td>{objeto.id}</td>
                                        <td>{objeto.nombre}</td>
                                        <td>{objeto.descripcion || '—'}</td>
                                        <td>
                                            <span className={`badge badge-${objeto.estado.toLowerCase()}`}>
                                                {objeto.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="danger-button"
                                                onClick={() => handleDelete(objeto.id, objeto.estado)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </Container>
    )
}

export default ObjetosPage