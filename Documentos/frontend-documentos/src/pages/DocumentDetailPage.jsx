import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import { getPublicDocumentById } from '../services/documentsService'

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL

function DocumentDetailPage() {
    const { id } = useParams()

    const [document, setDocument] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await getPublicDocumentById(id)

                setDocument(data.document || data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadDocument()
    }, [id])

    if (loading) {
        return (
            <main className='page'>
                <div className='container'>
                    <LoadingMessage text='Cargando documento...' />
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className='page'>
                <div className='container'>
                    <ErrorMessage message={error} />
                    <Link className='button button-secondary' to='/documentos'>
                        Volver a documentos
                    </Link>
                </div>
            </main>
        )
    }

    if (!document) {
        return (
            <main className='page'>
                <div className='container'>
                    <p className='empty-message'>Documento no encontrado.</p>
                    <Link className='button button-secondary' to='/documentos'>
                        Volver a documentos
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className='page'>
            <div className='container'>
                <article className='detail-card'>
                    <div className='document-meta'>
                        <span className='badge'>{document.type}</span>
                        <span className={document.is_public ? 'badge badge-public' : 'badge badge-private'}>
                            {document.is_public ? 'Público' : 'Privado'}
                        </span>
                    </div>

                    <h1>{document.title}</h1>

                    <p>{document.description || 'Este documento no tiene descripción.'}</p>

                    <p>
                        Propietario: <strong>{document.owner}</strong>
                    </p>

                    {document.created_at && (
                        <p>
                            Creado el: <strong>{new Date(document.created_at).toLocaleDateString()}</strong>
                        </p>
                    )}

                    <div className='actions'>
                        {document.file_name && (
                            <a
                                className='button'
                                href={`${UPLOADS_URL}/${document.file_name}`}
                                target='_blank'
                                rel='noreferrer'
                            >
                                Ver archivo
                            </a>
                        )}

                        <Link className='button button-secondary' to='/documentos'>
                            Volver a documentos
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    )
}

export default DocumentDetailPage
