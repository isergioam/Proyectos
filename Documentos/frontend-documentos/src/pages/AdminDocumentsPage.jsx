import { useEffect, useState } from 'react'
import { DocumentCard } from '../components/DocumentCard'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingMessage } from '../components/LoadingMessage'
import { Navbar } from '../components/Navbar'
import { getAllDocumentsAdmin } from '../services/documentsService'

export const AdminDocumentsPage = () => {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                setLoading(true)
                const response = await getAllDocumentsAdmin()
                setDocuments(response.data)
            } catch (apiError) {
                setError(apiError.message)
            } finally {
                setLoading(false)
            }
        }

        loadDocuments()
    }, [])

    return (
        <>
            <Navbar />
            <main className='container'>
                <h1>Administración de documentos</h1>
                <ErrorMessage message={error} />
                {loading && <LoadingMessage />}

                <section className='grid'>
                    {documents.map((document) => (
                        <DocumentCard key={document.id} document={document} />
                    ))}
                </section>
            </main>
        </>
    )
}