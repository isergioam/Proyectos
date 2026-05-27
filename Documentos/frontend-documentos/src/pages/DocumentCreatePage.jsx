import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocumentForm } from '../components/DocumentForm'
import { ErrorMessage } from '../components/ErrorMessage'
import { Navbar } from '../components/Navbar'
import { createDocument } from '../services/documentsService'

export const DocumentCreatePage = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const handleSubmit = async (formValues) => {
        try {
            const formData = new FormData()
            formData.append('title', formValues.title)
            formData.append('description', formValues.description)
            formData.append('type', formValues.type)
            formData.append('isPublic', formValues.isPublic)
            formData.append('file', formValues.file)

            await createDocument(formData)
            navigate('/mis-documentos')
        } catch (apiError) {
            setError(apiError.message)
        }
    }

    return (
        <>
            <Navbar />
            <main className='container'>
                <h1>Crear documento</h1>
                <ErrorMessage message={error} />
                <DocumentForm submitLabel='Crear documento' requiresFile onSubmit={handleSubmit} />
            </main>
        </>
    )
}