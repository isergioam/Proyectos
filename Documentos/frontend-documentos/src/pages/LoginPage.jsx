import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            await login(formData)
            navigate('/perfil')
        } catch (apiError) {
            setError(apiError.message)
        }
    }

    return (
        <>
            <Navbar />
            <div className='page'>
                <main className='container'>
                    <h1>Login</h1>
                    <ErrorMessage message={error} />

                    <form className='form' onSubmit={handleSubmit}>
                        <input name='email' type='email' value={formData.email} onChange={handleChange} placeholder='Email' />
                        <input name='password' type='password' value={formData.password} onChange={handleChange} placeholder='Password' />
                        <button type='submit'>Entrar</button>
                    </form>
                </main>
            </div>
        </>
    )
}

export default LoginPage