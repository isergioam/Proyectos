function CategoryForm({
    formData,
    submitText = 'Guardar categoría',
    onChange,
    onSubmit,
    onCancel
}) {
    return (
        <form className="form card" onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="category-name">Nombre de la categoría</label>
                <input
                    type="text"
                    id="category-name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Ejemplo: Portátiles"
                    required
                />
            </div>

            <div className="actions">
                <button type="submit" className="btn">
                    {submitText}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}

export default CategoryForm