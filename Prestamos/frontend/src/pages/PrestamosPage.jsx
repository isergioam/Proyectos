import { useEffect, useMemo, useState } from 'react'
import { fetchObjetos } from '../api/objetos.api'
import {
    createPrestamo,
    devolverPrestamo,
    fetchPrestamos
} from '../api/prestamos.api'
import Container from '../components/Container'
import Toast from '../components/Toast'

function formatDate(value) {
    if (!value) {
        return '—'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return date.toLocaleDateString('es-ES')
}

function PrestamosPage() {
    const [prestamos, setPrestamos] = useState([])
    const [objetos, setObjetos] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [returningId, setReturningId] = useState(null)
    const [form, setForm] = useState({
        objeto_id: '',
        prestamista_nombre: '',
        prestatario_nombre: '',
        fecha_prestamo: '',
        fecha_devolucion_prevista: '',
        notas: ''
    })
    const [toast, setToast] = useState({
        type: 'info',
        message: ''
    })

    const objetosDisponibles = useMemo(() => {
        return objetos.filter((objeto) => objeto.estado === 'DISPONIBLE')
    }, [objetos])

    async function loadData() {
        try {
            setLoading(true)

            const [prestamosData, objetosData] = await Promise.all([
                fetchPrestamos(),
                fetchObjetos()
            ])

            setPrestamos(prestamosData)
            setObjetos(objetosData)
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
        loadData()
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

        if (!form.objeto_id) {
            setToast({
                type: 'error',
                message: 'Debes seleccionar un objeto disponible.'
            })
            return
        }

        if (!form.prestamista_nombre.trim()) {
            setToast({
                type: 'error',
                message: 'Debes escribir el nombre del prestamista.'
            })
            return
        }

        if (!form.prestatario_nombre.trim()) {
            setToast({
                type: 'error',
                message: 'Debes escribir el nombre del prestatario.'
            })
            return
        }

        if (!form.fecha_prestamo) {
            setToast({
                type: 'error',
                message: 'Debes indicar la fecha de préstamo.'
            })
            return
        }

        try {
            setSubmitting(true)

            await createPrestamo({
                objeto_id: Number(form.objeto_id),
                prestamista_nombre: form.prestamista_nombre.trim(),
                prestatario_nombre: form.prestatario_nombre.trim(),
                fecha_prestamo: form.fecha_prestamo,
                fecha_devolucion_prevista: form.fecha_devolucion_prevista || null,
                notas: form.notas.trim()
            })

            setForm({
                objeto_id: '',
                prestamista_nombre: '',
                prestatario_nombre: '',
                fecha_prestamo: '',
                fecha_devolucion_prevista: '',
                notas: ''
            })

            setToast({
                type: 'success',
                message: 'Préstamo creado correctamente.'
            })

            await loadData()
        } catch (error) {
            setToast({
                type: 'error',
                message: error.message
            })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDevolver(id, estado) {
        if (estado === 'DEVUELTO') {
            setToast({
                type: 'error',
                message: 'Ese préstamo ya estaba devuelto.'
            })
            return
        }

        try {
            setReturningId(id)

            await devolverPrestamo(id)

            setToast({
                type: 'success',
                message: 'Préstamo marcado como devuelto.'
            })

            await loadData()
        } catch (error) {
            setToast({
                type: 'error',
                message: error.message
            })
        } finally {
            setReturningId(null)
        }
    }

    return (
        <Container>
            <div className="page-header">
                <p className="eyebrow">Fase 7</p>
                <h1>Gestión de préstamos</h1>
                <p className="lead">
                    Pantalla revisada y pulida para la entrega final del proyecto.
                </p>
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ type: 'info', message: '' })}
            />

            <section className="card">
                <h2>Registrar nuevo préstamo</h2>

                {objetosDisponibles.length === 0 ? (
                    <p>No hay objetos disponibles para prestar en este momento.</p>
                ) : (
                    <form className="loan-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="objeto_id">Objeto disponible</label>
                                <select
                                    id="objeto_id"
                                    name="objeto_id"
                                    value={form.objeto_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona un objeto</option>
                                    {objetosDisponibles.map((objeto) => (
                                        <option key={objeto.id} value={objeto.id}>
                                            {objeto.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="prestatario_nombre">Prestatario</label>
                                <input
                                    id="prestatario_nombre"
                                    name="prestatario_nombre"
                                    type="text"
                                    maxLength="120"
                                    value={form.prestatario_nombre}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Laura"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fecha_prestamo">Fecha de préstamo</label>
                                <input
                                    id="fecha_prestamo"
                                    name="fecha_prestamo"
                                    type="date"
                                    value={form.fecha_prestamo}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fecha_devolucion_prevista">Fecha devolución prevista</label>
                                <input
                                    id="fecha_devolucion_prevista"
                                    name="fecha_devolucion_prevista"
                                    type="date"
                                    value={form.fecha_devolucion_prevista}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notas">Notas</label>
                            <textarea
                                id="notas"
                                name="notas"
                                rows="4"
                                maxLength="255"
                                value={form.notas}
                                onChange={handleChange}
                                placeholder="Ejemplo: Entregar con cargador"
                            />
                            <small className="helper-text">Máximo 255 caracteres.</small>
                        </div>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Guardando préstamo...' : 'Crear préstamo'}
                        </button>
                    </form>
                )}
            </section>

            <section className="card">
                <h2>Listado de préstamos</h2>

                {loading ? (
                    <p>Cargando préstamos...</p>
                ) : prestamos.length === 0 ? (
                    <p>No hay préstamos registrados todavía.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Objeto</th>
                                    <th>Prestamista</th>
                                    <th>Prestatario</th>
                                    <th>Fecha préstamo</th>
                                    <th>Prevista</th>
                                    <th>Real</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamos.map((prestamo) => (
                                    <tr key={prestamo.id}>
                                        <td>{prestamo.id}</td>
                                        <td>{prestamo.objeto_nombre}</td>
                                        <td>{prestamo.prestamista_nombre}</td>
                                        <td>{prestamo.prestatario_nombre}</td>
                                        <td>{formatDate(prestamo.fecha_prestamo)}</td>
                                        <td>{formatDate(prestamo.fecha_devolucion_prevista)}</td>
                                        <td>{formatDate(prestamo.fecha_devolucion_real)}</td>
                                        <td>
                                            <span className={`badge badge-loan-${prestamo.estado.toLowerCase()}`}>
                                                {prestamo.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="secondary-button"
                                                disabled={prestamo.estado === 'DEVUELTO' || returningId === prestamo.id}
                                                onClick={() => handleDevolver(prestamo.id, prestamo.estado)}
                                            >
                                                {returningId === prestamo.id ? 'Devolviendo...' : 'Marcar devuelto'}
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

export default PrestamosPage