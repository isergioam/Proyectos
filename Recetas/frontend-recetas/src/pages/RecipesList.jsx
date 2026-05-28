import { useEffect, useState } from "react";
import { api } from "../api.js";
import Stars from "../components/Stars.jsx";
import Pagination from "../components/Pagination.jsx";

export default function RecipesList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1, limit: 10, total: 0 });

    // filtros
    const [q, setQ] = useState("");
    const [minStars, setMinStars] = useState("");
    const [order, setOrder] = useState("recent");
    const [ingredientId, setIngredientId] = useState("");

    const [ingredients, setIngredients] = useState([]);

    async function load(page = 1) {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                limit: meta.limit,
                q: q.trim(),
                minStars: minStars ? String(minStars) : "",
                order,
                ingredientId: ingredientId ? String(ingredientId) : "",
            };

            // limpiamos params vacíos (para URLs más limpias)
            Object.keys(params).forEach((k) => {
                if (params[k] === "") delete params[k];
            });

            const res = await api.listRecipes(params);
            setItems(res.data);
            setMeta(res.meta);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // cargar ingredientes para el filtro
        api.listIngredients("")
            .then((r) => setIngredients(r.data))
            .catch(() => { });
    }, []);

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    function onApplyFilters() {
        load(1);
    }

    return (
        <section className="card">
            <h2>Listado</h2>

            <div className="filters">
                <input
                    placeholder="Buscar por texto (título/descripcion)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />

                <select value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}>
                    <option value="">(Ingrediente cualquiera)</option>
                    {ingredients.map((i) => (
                        <option key={i.id} value={i.id}>{i.nombre}</option>
                    ))}
                </select>

                <select value={minStars} onChange={(e) => setMinStars(e.target.value)}>
                    <option value="">(Sin mínimo de ⭐)</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5</option>
                </select>

                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="recent">Más recientes</option>
                    <option value="top">Mejor valoradas</option>
                </select>

                <button onClick={onApplyFilters}>Aplicar</button>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className="error">❌ {error}</p>}

            {!loading && !error && (
                <>
                    <p className="muted">
                        Total: <b>{meta.total}</b>
                    </p>

                    <div className="grid">
                        {items.map((r) => (
                            <a key={r.id} className="item" href={`#/recipe/${r.id}`}>
                                <div className="item-head">
                                    <h3>{r.titulo}</h3>
                                    <Stars value={r.rating_media ? Number(r.rating_media) : 0} readOnly />
                                </div>
                                <p className="muted">{r.descripcion}</p>
                                <div className="tags">
                                    <span className="tag">{r.dificultad}</span>
                                    {r.tiempo_min ? <span className="tag">{r.tiempo_min} min</span> : null}
                                    {r.porciones ? <span className="tag">{r.porciones} porciones</span> : null}
                                    <span className="tag">⭐ {r.rating_total}</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    <Pagination
                        page={meta.page}
                        totalPages={meta.totalPages}
                        onPage={(p) => load(p)}
                    />
                </>
            )}
        </section>
    );
}
