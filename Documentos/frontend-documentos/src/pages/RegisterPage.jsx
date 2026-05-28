import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { registerUser } from '../services/authService.js'
import Navbar from '../components/Navbar.jsx'

function RegisterPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

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
            setLoading(true)
            setError(null)
            setSuccess(null)

            const response = await registerUser(formData)

            setSuccess(response.message || 'Usuario registrado correctamente')

            setTimeout(() => {
                navigate('/login')
            }, 1200)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <Navbar />
            <div className="page">


                <h1 className="page-title">Registro de usuario</h1>
                <p className="page-subtitle">
                    Crea una cuenta para poder iniciar sesión y consultar tu perfil.
                </p>

                <ErrorMessage message={error} />

                {success && (
                    <div className="alert alert-success">
                        {success}. Redirigiendo al login...
                    </div>
                )}

                <form className="form card" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ejemplo: Laura Pérez"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="usuario@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo recomendado: 6 caracteres"
                            required
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Registrando usuario...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="auth-helper-text">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.
                </p>
            </div>
        </section>
    )
}

export default RegisterPage