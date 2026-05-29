import { useState } from 'react'
import { getBudgetAdvice } from '../services/aiService'

export const AIBudgetAdvisor = () => {
    const [formData, setFormData] = useState({
        message: '',
        budget: ''
    })
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError('')
            setAnswer('')

            const data = await getBudgetAdvice({
                message: formData.message,
                budget: Number(formData.budget)
            })

            setAnswer(data.answer)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='ai-tool-card'>
            <header className='ai-tool-header'>
                <span className='ai-tool-kicker'>Herramienta 2</span>
                <h2>Asesor por presupuesto</h2>
                <p>Indica cuánto dinero tiene el cliente y qué necesita comprar.</p>
            </header>

            <form className='ai-form' onSubmit={handleSubmit}>
                <div className='ai-form-group'>
                    <label htmlFor='budget-message'>Necesidad</label>
                    <textarea
                        id='budget-message'
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        placeholder='Ej: quiero mejorar mi escritorio para teletrabajo'
                        required
                    />
                </div>

                <div className='ai-form-group'>
                    <label htmlFor='budget'>Presupuesto máximo</label>
                    <input
                        id='budget'
                        type='number'
                        name='budget'
                        min='1'
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder='Ej: 350'
                        required
                    />
                </div>

                <button type='submit' disabled={loading}>
                    {loading ? 'Analizando...' : 'Pedir consejo'}
                </button>
            </form>

            {error && <p className='ai-error'>{error}</p>}
            {answer && <div className='ai-answer'>{answer}</div>}
        </section>
    )
}