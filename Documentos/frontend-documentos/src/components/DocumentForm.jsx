import { useEffect, useState } from 'react'

const initialForm = {
    title: '',
    description: '',
    type: 'pdf',
    isPublic: false,
    file: null
}

export const DocumentForm = ({ initialData, submitLabel, requiresFile = false, onSubmit }) => {
    const [formData, setFormData] = useState(initialForm)

    useEffect(() => {
        if (!initialData) return

        setFormData({
            title: initialData.title || '',
            description: initialData.description || '',
            type: initialData.type || 'pdf',
            isPublic: Boolean(initialData.is_public),
            file: null
        })
    }, [initialData])

    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target

        setFormData((current) => ({
            ...current,
            [name]: type === 'file'
                ? files[0]
                : type === 'checkbox'
                    ? checked
                    : value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit(formData)
    }

    return (
        <form className='form' onSubmit={handleSubmit}>
            <label>
                Título
                <input name='title' value={formData.title} onChange={handleChange} required />
            </label>

            <label>
                Descripción
                <textarea name='description' value={formData.description} onChange={handleChange} />
            </label>

            <label>
                Tipo
                <select name='type' value={formData.type} onChange={handleChange}>
                    <option value='pdf'>PDF</option>
                    <option value='word'>Word</option>
                    <option value='image'>Imagen</option>
                    <option value='other'>Otro</option>
                </select>
            </label>

            <label>
                <input name='isPublic' type='checkbox' checked={formData.isPublic} onChange={handleChange} />
                Documento público
            </label>

            {requiresFile && (
                <label>
                    Archivo
                    <input name='file' type='file' onChange={handleChange} required />
                </label>
            )}

            <button type='submit'>{submitLabel}</button>
        </form>
    )
}