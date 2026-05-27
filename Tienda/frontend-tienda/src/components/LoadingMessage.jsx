function LoadingMessage({ text = 'Cargando...' }) {
    return (
        <div className="card">
            <p>{text}</p>
        </div>
    )
}

export default LoadingMessage