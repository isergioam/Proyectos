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
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        <section className="recipe-detail">
            <div className="back-bar">
                <a href="#/list" className="btn-back">← Volver al listado</a>
            </div>

            <div className="recipe-hero">
                <div className="hero-img-container">
                    <img 
                        src={recipe.foto_url && recipe.foto_url.trim() !== "" ? recipe.foto_url : "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80"} 
                        alt={recipe.titulo}
                        className="hero-img"
                        style={{
                            transform: `translate3d(0, ${scrollY * 0.25}px, 0) scale(1.15)`,
                            transformOrigin: "center center"
                        }}
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80";
                        }}
                    />
                    <div className="hero-grad"></div>
                    <div className="hero-content">
                        <span className="detail-difficulty-badge" data-difficulty={recipe.dificultad}>
                            {recipe.dificultad}
                        </span>
                        <h2>{recipe.titulo}</h2>
                        <p className="hero-desc">{recipe.descripcion}</p>
                    </div>
                </div>
            </div>

            <div className="recipe-meta-cards">
                <div className="meta-card">
                    <span className="meta-icon">👨‍🍳</span>
                    <div className="meta-info">
                        <span className="meta-lbl">Creador</span>
                        <span className="meta-val">{recipe.autor_nombre}</span>
                    </div>
                </div>
                {recipe.tiempo_min ? (
                    <div className="meta-card">
                        <span className="meta-icon">⏱️</span>
                        <div className="meta-info">
                            <span className="meta-lbl">Tiempo</span>
                            <span className="meta-val">{recipe.tiempo_min} mins</span>
                        </div>
                    </div>
                ) : null}
                {recipe.porciones ? (
                    <div className="meta-card">
                        <span className="meta-icon">👥</span>
                        <div className="meta-info">
                            <span className="meta-lbl">Porciones</span>
                            <span className="meta-val">{recipe.porciones} raciones</span>
                        </div>
                    </div>
                ) : null}
                <div className="meta-card rating-highlight-card">
                    <span className="meta-icon">⭐</span>
                    <div className="meta-info">
                        <span className="meta-lbl">Valoración ({rating.total} votos)</span>
                        <span className="meta-val">{rating.media ? rating.media.toFixed(2) : "0.00"} / 5.0</span>
                    </div>
                    <div className="meta-stars">
                        <Stars value={rating.media ? rating.media : 0} readOnly />
                    </div>
                </div>
            </div>

            <div className="recipe-main-grid">
                <div className="ingredients-card card">
                    <h3>🛒 Lista de Ingredientes</h3>
                    <p className="helper-text">Toca cada uno para marcarlo mientras cocinas:</p>
                    <ul className="ingredients-checklist">
                        {ingredients.map((i) => (
                            <li key={i.id} className="ingredient-checklist-item">
                                <label className="chk-label">
                                    <input type="checkbox" className="chk-input" />
                                    <span className="chk-custom"></span>
                                    <span className="chk-text">
                                        <span className="ing-name">{i.nombre}</span>
                                        {i.cantidad !== null || i.unidad ? (
                                            <span className="ing-qty">
                                                {i.cantidad !== null ? i.cantidad : ""} {i.unidad || ""}
                                            </span>
                                        ) : null}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="steps-card card">
                    <h3>🍳 Instrucciones de Preparación</h3>
                    <div className="steps-timeline">
                        {recipe.pasos.split("\n").filter(p => p.trim() !== "").map((step, idx) => (
                            <div key={idx} className="timeline-step">
                                <div className="step-badge">{idx + 1}</div>
                                <div className="step-content">
                                    <p>{step}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="community-section card">
                <div className="community-header">
                    <h3>💬 Opiniones de la Comunidad</h3>
                    <p className="muted">La cocina sabe mejor cuando se comparte. ¡Deja tu comentario!</p>
                </div>

                <div className="feedback-form">
                    <h4>Comparte tu valoración</h4>
                    <div className="feedback-grid">
                        <div className="input-group">
                            <label>Tu nombre</label>
                            <input placeholder="Ej. Ana García" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Tu email</label>
                            <input placeholder="Ej. ana@cook.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="rate-interactive-area">
                        <span>Puntúa la receta:</span>
                        <Stars value={stars} onChange={sendRating} />
                        {stars > 0 && <span className="stars-feedback-lbl">¡Le has dado {stars} estrellas!</span>}
                    </div>

                    <div className="comment-input-area">
                        <label>Tu comentario</label>
                        <textarea
                            rows={3}
                            placeholder="¿Qué te pareció la receta? ¿Hiciste algún cambio?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className="primary btn-submit-comment" onClick={sendComment}>Publicar Comentario</button>
                    </div>
                </div>

                <div className="comments-list">
                    <h4>Comentarios ({comments.length})</h4>
                    {comments.length === 0 && (
                        <p className="no-comments">Aún no hay comentarios. ¡Sé el primero en compartir tu experiencia!</p>
                    )}
                    {comments.map((c) => (
                        <div key={c.id} className="comment-card">
                            <div className="comment-avatar">
                                {c.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="comment-bubble">
                                <div className="comment-bubble-header">
                                    <h5>{c.nombre}</h5>
                                    <span className="comment-date">
                                        {new Date(c.created_at).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="comment-text">{c.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
