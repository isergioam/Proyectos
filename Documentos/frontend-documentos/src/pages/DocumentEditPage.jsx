import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DocumentForm from '../components/DocumentForm'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import Navbar from '../components/Navbar'
import { getMyDocuments, updateDocument } from '../services/documentsService'

function DocumentEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [document, setDocument] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true)
                const response = await getMyDocuments()
                const foundDocument = response.data.find((item) => String(item.id) === String(id))

                if (!foundDocument) {
                    setError('Documento no encontrado')
                    return
                }

                setDocument(foundDocument)
            } catch (apiError) {
                setError(apiError.message)
            } finally {
                setLoading(false)
            }
        }

        loadDocument()
    }, [id])

    const handleSubmit = async (formValues) => {
        try {
            await updateDocument(id, {
                title: formValues.title,
                description: formValues.description,
                type: formValues.type,
                isPublic: formValues.isPublic
            })

            navigate('/mis-documentos')
        } catch (apiError) {
            setError(apiError.message)
        }
    }

    return (
        <>
            <Navbar />
            <main className='container'>
                <h1>Editar documento</h1>
                <ErrorMessage message={error} />
                {loading && <LoadingMessage />}
                {document && <DocumentForm initialData={document} submitLabel='Guardar cambios' onSubmit={handleSubmit} />}
            </main>
        </>
    )
}

export default DocumentEditPage