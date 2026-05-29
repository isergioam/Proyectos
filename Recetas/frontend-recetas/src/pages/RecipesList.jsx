import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import Stars from "../components/Stars.jsx";
import Pagination from "../components/Pagination.jsx";

const LIMIT = 10;

export default function RecipesList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        totalPages: 1,
        limit: LIMIT,
        total: 0,
    });

    // filtros
    const [q, setQ] = useState("");
    const [minStars, setMinStars] = useState("");
    const [order, setOrder] = useState("recent");
    const [ingredientId, setIngredientId] = useState("");

    const [ingredients, setIngredients] = useState([]);

    const load = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const params = Object.fromEntries(
                Object.entries({
                    page,
                    limit: LIMIT,
                    q: q.trim(),
                    minStars: minStars ? String(minStars) : "",
                    order,
                    ingredientId: ingredientId ? String(ingredientId) : "",
                }).filter(([, value]) => value !== "")
            );

            const res = await api.listRecipes(params);

            setItems(res?.data ?? []);

            setMeta(
                res?.meta ?? {
                    page: 1,
                    totalPages: 1,
                    limit: LIMIT,
                    total: 0,
                }
            );
        } catch (e) {
            setError(e.message || "Error cargando recetas");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [q, minStars, order, ingredientId]);

    useEffect(() => {
        // cargar ingredientes
        api.listIngredients("")
            .then((r) => {
                setIngredients(r?.data ?? []);
            })
            .catch(() => {
                setIngredients([]);
            });
    }, []);

    useEffect(() => {
        load(1);
    }, [load]);

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

                <select
                    value={ingredientId}
                    onChange={(e) => setIngredientId(e.target.value)}
                >
                    <option value="">(Ingrediente cualquiera)</option>

                    {Array.isArray(ingredients) &&
                        ingredients.map((i) => (
                            <option key={i.id} value={i.id}>
                                {i.nombre}
                            </option>
                        ))}
                </select>

                <select
                    value={minStars}
                    onChange={(e) => setMinStars(e.target.value)}
                >
                    <option value="">(Sin mínimo de ⭐)</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5</option>
                </select>

                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                >
                    <option value="recent">Más recientes</option>
                    <option value="top">Mejor valoradas</option>
                </select>

                <button onClick={onApplyFilters}>
                    Aplicar
                </button>
            </div>

            {loading && items.length === 0 && (
                <p>Cargando...</p>
            )}

            {error && (
                <p className="error">
                    ❌ {error}
                </p>
            )}

            {!error && (
                <>
                    <p className="muted">
                        Total: <b>{meta.total}</b>
                    </p>

                    <div className="grid">
                        {Array.isArray(items) &&
                            items.map((r) => {
                                const rating = Number(r.rating_media || 0);
                                const recipeImage = r.foto_url && r.foto_url.trim() !== "" 
                                    ? r.foto_url 
                                    : "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60";

                                return (
                                    <a
                                        key={r.id}
                                        className="item-card"
                                        href={`#/recipe/${r.id}`}
                                    >
                                        <div className="item-card-image-wrapper">
                                            <img
                                                src={recipeImage}
                                                alt={r.titulo}
                                                className="item-card-image"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60";
                                                }}
                                            />
                                            <span className="difficulty-badge" data-difficulty={r.dificultad}>
                                                {r.dificultad}
                                            </span>
                                        </div>

                                        <div className="item-card-body">
                                            <div className="item-card-head">
                                                <h3>{r.titulo}</h3>
                                                <Stars
                                                    value={rating}
                                                    readOnly
                                                />
                                            </div>

                                            <p className="item-card-desc">
                                                {r.descripcion}
                                            </p>

                                            <div className="item-card-meta">
                                                {r.tiempo_min ? (
                                                    <span className="meta-tag">
                                                        ⏱️ {r.tiempo_min} min
                                                    </span>
                                                ) : null}

                                                {r.porciones ? (
                                                    <span className="meta-tag">
                                                        👥 {r.porciones} porc.
                                                    </span>
                                                ) : null}

                                                <span className="meta-tag rating-tag">
                                                    💬 {r.rating_total || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
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