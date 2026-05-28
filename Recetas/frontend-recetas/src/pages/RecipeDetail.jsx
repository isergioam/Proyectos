import { useEffect, useState } from "react";
import { api } from "../api.js";
import Stars from "../components/Stars.jsx";

export default function RecipeDetail({ id }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [data, setData] = useState(null);

    // forms: comment + rating (sin login)
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");

    const [comment, setComment] = useState("");
    const [stars, setStars] = useState(0);

    async function load() {
        try {
            setLoading(true);
            setError("");
            const res = await api.getRecipe(id);
            setData(res);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function sendComment() {
        try {
            await api.addComment(id, {
                user: { nombre, email },
                texto: comment,
            });
            setComment("");
            await load();
        } catch (e) {
            alert(e.message);
        }
    }

    async function sendRating(n) {
        try {
            setStars(n);
            await api.rateRecipe(id, {
                user: { nombre, email },
                estrellas: n,
            });
            await load();
        } catch (e) {
            alert(e.message);
        }
    }

    if (loading) return <section className="card"><p>Cargando...</p></section>;
    if (error) return <section className="card"><p className="error">❌ {error}</p></section>;
    if (!data) return null;

    const { recipe, ingredients, comments, rating } = data;

    return (
        <section className="card">
            <a href="#/list">← Volver</a>

            <div className="detail-head">
                <div>
                    <h2>{recipe.titulo}</h2>
                    <p className="muted">{recipe.descripcion}</p>
                    <p className="muted">
                        Autor: <b>{recipe.autor_nombre}</b> · {recipe.dificultad}
                        {recipe.tiempo_min ? ` · ${recipe.tiempo_min} min` : ""}
                        {recipe.porciones ? ` · ${recipe.porciones} porciones` : ""}
                    </p>
                </div>

                <div className="ratingBox">
                    <div className="muted">Media: <b>{rating.media ? rating.media.toFixed(2) : "0.00"}</b> · ({rating.total} votos)</div>
                    <Stars value={rating.media ? rating.media : 0} readOnly />
                </div>
            </div>

            <h3>Ingredientes</h3>
            <ul>
                {ingredients.map((i) => (
                    <li key={i.id}>
                        {i.nombre}
                        {i.cantidad !== null ? ` — ${i.cantidad}` : ""}
                        {i.unidad ? ` ${i.unidad}` : ""}
                    </li>
                ))}
            </ul>

            <h3>Pasos</h3>
            <pre className="steps">{recipe.pasos}</pre>

            <hr />

            <h3>Participa (sin login)</h3>
            <p className="muted">
                Aquí pedimos nombre y email para “firmar” comentario/valoración. Es lo mínimo para que no sea el salvaje oeste.
            </p>

            <div className="row2">
                <input placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <input placeholder="Tu email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="rateArea">
                <span>Tu puntuación:</span>
                <Stars value={stars} onChange={sendRating} />
            </div>

            <div className="commentBox">
                <textarea
                    rows={3}
                    placeholder="Escribe un comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={sendComment}>Enviar comentario</button>
            </div>

            <h3>Comentarios</h3>
            {comments.length === 0 && <p className="muted">Aún no hay comentarios. Sé el primero (sin presión… bueno, un poco sí).</p>}
            {comments.map((c) => (
                <div key={c.id} className="comment">
                    <div className="commentHead">
                        <b>{c.nombre}</b> <span className="muted">({new Date(c.created_at).toLocaleString()})</span>
                    </div>
                    <div>{c.texto}</div>
                </div>
            ))}
        </section>
    );
}
