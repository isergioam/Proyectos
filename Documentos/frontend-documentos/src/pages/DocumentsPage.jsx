import { useEffect, useState } from 'react'
import DocumentCard from '../components/DocumentCard'
import DocumentsFilters from '../components/DocumentsFilters'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import Navbar from '../components/Navbar'
import { getPublicDocuments } from '../services/documentsService'

const initialFilters = {
    search: '',
    type: '',
    page: 1,
    limit: 10
}

function DocumentsPage() {
    const [filters, setFilters] = useState(initialFilters)
    const [documents, setDocuments] = useState([])
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadDocuments = async (filtersToApply = filters) => {
        try {
            setLoading(true)
            setError('')

            const response = await getPublicDocuments(filtersToApply)
            setDocuments(response.data)
            setMeta(response.meta)
        } catch (apiError) {
            setError(apiError.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDocuments(initialFilters)
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFilters({ ...filters, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        loadDocuments({ ...filters, page: 1 })
    }

    const handleReset = () => {
        setFilters(initialFilters)
        loadDocuments(initialFilters)
    }

    return (
        <>
            <Navbar />
            <main className='container'>
                <h1>Documentos públicos</h1>

                <DocumentsFilters
                    filters={filters}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                />

                <ErrorMessage message={error} />
                {loading && <LoadingMessage />}

                <section className='grid'>
                    {documents.map((document) => (
                        <DocumentCard key={document.id} document={document} />
                    ))}
                </section>

                {meta && <p>Total: {meta.total} documentos</p>}
            </main>
        </>
    )
}

export default DocumentsPage