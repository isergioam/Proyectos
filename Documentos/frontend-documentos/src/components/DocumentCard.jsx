import { Link } from 'react-router-dom'

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL

export const DocumentCard = ({ document, editable = false, onDelete }) => {
    const fileUrl = `${UPLOADS_URL}/${document.file_name}`

    return (
        <article className='card'>
            <h3>{document.title}</h3>
            <p>{document.description || 'Sin descripción'}</p>
            <p>Tipo: {document.type}</p>
            <p>{document.is_public ? 'Público' : 'Privado'}</p>

            {document.owner && <p>Propietario: {document.owner}</p>}

            <a href={fileUrl} target='_blank' rel='noreferrer'>
                Abrir documento
            </a>

            {editable && (
                <div className='actions'>
                    <Link to={`/mis-documentos/${document.id}`}>Editar</Link>
                    <button type='button' onClick={() => onDelete(document.id)}>
                        Eliminar
                    </button>
                </div>
            )}
        </article>
    )
}