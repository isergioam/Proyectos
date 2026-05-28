export default function IngredientRow({ item, onChange, onRemove }) {
    return (
        <div className="row3">
            <input
                placeholder="Ingrediente (nombre)"
                value={item.nombre}
                onChange={(e) => onChange({ ...item, nombre: e.target.value })}
            />
            <input
                placeholder="Cantidad"
                value={item.cantidad}
                onChange={(e) => onChange({ ...item, cantidad: e.target.value })}
            />
            <input
                placeholder="Unidad (g, ml, cda...)"
                value={item.unidad}
                onChange={(e) => onChange({ ...item, unidad: e.target.value })}
            />
            <button className="danger" onClick={onRemove}>
                ✖
            </button>
        </div>
    );
}


