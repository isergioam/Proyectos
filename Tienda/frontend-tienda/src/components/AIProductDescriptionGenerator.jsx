import { useState } from 'react'
import { generateProductDescriptionWithAI } from '../services/aiService'

export const AIProductDescriptionGenerator = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        features: ''
    })
    const [description, setDescription] = useState('')
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
            setDescription('')

            const data = await generateProductDescriptionWithAI(formData)
            setDescription(data.description)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const copyDescription = async () => {
        if (!description) return
        await navigator.clipboard.writeText(description)
    }

    return (
        <section className='ai-tool-card ai-tool-card--admin'>
            <header className='ai-tool-header'>
                <span className='ai-tool-kicker'>Herramienta 4 · Admin</span>
                <h2>Generador de descripciones</h2>
                <p>Crea textos comerciales para fichas de producto desde el panel de administración.</p>
            </header>

            <form className='ai-form' onSubmit={handleSubmit}>
                <div className='ai-form-group'>
                    <label htmlFor='description-name'>Nombre del producto</label>
                    <input
                        id='description-name'
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Ej: Teclado mecánico RGB'
                        required
                    />
                </div>

                <div className='ai-form-group'>
                    <label htmlFor='description-category'>Categoría</label>
                    <input
                        id='description-category'
                        type='text'
                        name='category'
                        value={formData.category}
                        onChange={handleChange}
                        placeholder='Ej: Periféricos'
                    />
                </div>

                <div className='ai-form-group'>
                    <label htmlFor='description-features'>Características</label>
                    <textarea
                        id='description-features'
                        name='features'
                        value={formData.features}
                        onChange={handleChange}
                        placeholder='Ej: switches azules, iluminación RGB, reposamuñecas'
                    />
                </div>

                <button type='submit' disabled={loading}>
                    {loading ? 'Generando...' : 'Generar descripción'}
                </button>
            </form>

            {error && <p className='ai-error'>{error}</p>}

            {description && (
                <div className='ai-answer'>
                    <p>{description}</p>
                    <button className='ai-secondary-button' type='button' onClick={copyDescription}>
                        Copiar descripción
                    </button>
                </div>
            )}
        </section>
    )
}