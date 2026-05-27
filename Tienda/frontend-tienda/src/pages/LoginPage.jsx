import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
    const navigate = useNavigate()
    const { login, isAdmin } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState(null)
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

            const response = await login(formData)

            if (response.user?.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/perfil')
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <h1 className="page-title">Iniciar sesión</h1>
            <p className="page-subtitle">
                Accede con tu email y contraseña para consultar tu perfil o administrar la tienda si tienes permisos.
            </p>

            <ErrorMessage message={error} />

            <form className="form card" onSubmit={handleSubmit}>
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
                        placeholder="Tu contraseña"
                        required
                    />
                </div>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
            </form>

            <p className="auth-helper-text">
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>.
            </p>
        </section>
    )
}

export default LoginPage