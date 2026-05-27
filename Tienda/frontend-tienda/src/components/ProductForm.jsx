function ProductForm({
    formData,
    categories,
    submitText = 'Guardar producto',
    onChange,
    onSubmit
}) {
    return (
        <form className="form card" onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Ejemplo: Portátil Gaming"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Descripción del producto"
                />
            </div>

            <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    min="0.01"
                    step="0.01"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={onChange}
                    min="0"
                    step="1"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="categoryId">Categoría</label>
                <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={onChange}
                >
                    <option value="">Sin categoría</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit" className="btn">
                {submitText}
            </button>
        </form>
    )
}

export default ProductForm