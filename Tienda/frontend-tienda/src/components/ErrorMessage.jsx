function ErrorMessage({ message = 'Se ha producido un error' }) {
    if (!message) {
        return null
    }

    return (
        <div className="alert alert-error">
            {message}
        </div>
    )
}

export default ErrorMessage