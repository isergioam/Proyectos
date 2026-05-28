function DocumentsFilters({ filters, onChange, onSubmit, onReset }) {
    return (
        <form className='filters' onSubmit={onSubmit}>
            <input
                type='search'
                name='search'
                value={filters.search}
                onChange={onChange}
                placeholder='Buscar por título'
            />

            <select name='type' value={filters.type} onChange={onChange}>
                <option value=''>Todos los tipos</option>
                <option value='pdf'>PDF</option>
                <option value='word'>Word</option>
                <option value='image'>Imagen</option>
                <option value='other'>Otro</option>
            </select>

            <button type='submit'>Buscar</button>
            <button type='button' onClick={onReset}>Limpiar</button>
        </form>
    )
}

export default DocumentsFilters