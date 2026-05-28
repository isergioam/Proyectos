import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DocumentCard from '../components/DocumentCard'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import Navbar from '../components/Navbar'
import { deleteDocument, getMyDocuments } from '../services/documentsService'

function MyDocumentsPage() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadDocuments = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await getMyDocuments()
            setDocuments(response.data)
        } catch (apiError) {
            setError(apiError.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDocuments()
    }, [])

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar este documento?')

        if (!confirmDelete) return

        try {
            await deleteDocument(id)
            await loadDocuments()
        } catch (apiError) {
            setError(apiError.message)
        }
    }

    return (
        <>
            <Navbar />
            <main className='container'>
                <h1>Mis documentos</h1>
                <Link to='/mis-documentos/nuevo'>Crear documento</Link>

                <ErrorMessage message={error} />
                {loading && <LoadingMessage />}

                <section className='grid'>
                    {documents.map((document) => (
                        <DocumentCard
                            key={document.id}
                            document={document}
                            editable
                            onDelete={handleDelete}
                        />
                    ))}
                </section>
            </main>
        </>
    )
}

export default MyDocumentsPage