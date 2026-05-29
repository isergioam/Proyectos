import { useState } from "react";
import { api } from "../api.js";
import IngredientRow from "../components/IngredientRow.jsx";

export default function RecipeCreate() {
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");

    // user
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");

    // recipe
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [pasos, setPasos] = useState("");
    const [tiempoMin, setTiempoMin] = useState("");
    const [porciones, setPorciones] = useState("");
    const [dificultad, setDificultad] = useState("media");
    const [fotoUrl, setFotoUrl] = useState("");

    // ingredients
    const [ingredients, setIngredients] = useState([
        { nombre: "", cantidad: "", unidad: "" },
    ]);

    function addIng() {
        setIngredients([...ingredients, { nombre: "", cantidad: "", unidad: "" }]);
    }

    function changeIng(idx, val) {
        const copy = [...ingredients];
        copy[idx] = val;
        setIngredients(copy);
    }

    function removeIng(idx) {
        const copy = [...ingredients];
        copy.splice(idx, 1);
        setIngredients(copy.length ? copy : [{ nombre: "", cantidad: "", unidad: "" }]);
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setOk("");

        try {
            const payload = {
                user: { nombre, email },
                recipe: {
                    titulo,
                    descripcion,
                    pasos,
                    tiempo_min: tiempoMin,
                    porciones,
                    dificultad,
                    foto_url: fotoUrl,
                },
                ingredients: ingredients
                    .filter((i) => i.nombre.trim() !== "")
                    .map((i) => ({
                        nombre: i.nombre.trim(),
                        cantidad: i.cantidad === "" ? null : Number(i.cantidad),
                        unidad: i.unidad.trim() || null,
                    })),
            };

            const res = await api.createRecipe(payload);
            setOk(`✅ Receta creada con id ${res.id}. Ya puedes verla en el listado.`);
            window.location.hash = "#/list";
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <section className="recipe-create">
            <div className="back-bar">
                <a href="#/list" className="btn-back">← Cancelar y volver</a>
            </div>

            <div className="card form-container-card">
                <h2>🍳 Comparte tu Creación Culinaria</h2>
                <p className="form-subtitle">Publica tu receta favorita para que otros miembros de GustoShare puedan cocinarla y valorarla.</p>

                {error && <p className="error-banner">⚠️ Error: {error}</p>}
                {ok && <p className="ok-banner">{ok}</p>}

                <form onSubmit={onSubmit} className="social-form">
                    <div className="form-section card-inner">
                        <h3>👤 Información del Chef</h3>
                        <p className="section-helper">Tu nombre aparecerá firmado como creador de la receta.</p>
                        <div className="row-inputs">
                            <div className="form-group-custom">
                                <label>Tu Nombre</label>
                                <input placeholder="Ej. Carlos Arguiñano" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>
                            <div className="form-group-custom">
                                <label>Tu Email (privado)</label>
                                <input type="email" placeholder="Ej. chef@gustoshare.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-section card-inner">
                        <h3>🍲 Detalles de la Receta</h3>
                        <p className="section-helper">Describe tu plato y añade los tiempos y raciones recomendadas.</p>
                        
                        <div className="form-group-custom">
                            <label>Título del Plato</label>
                            <input placeholder="Ej. Lasaña Casera de Espinacas y Ricotta" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                        </div>

                        <div className="form-group-custom">
                            <label>Breve Descripción</label>
                            <input placeholder="Ej. Una lasaña súper cremosa y llena de sabor, perfecta para el domingo." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                        </div>

                        <div className="row-three-inputs">
                            <div className="form-group-custom">
                                <label>Tiempo (minutos)</label>
                                <input type="number" placeholder="Ej. 45" value={tiempoMin} onChange={(e) => setTiempoMin(e.target.value)} />
                            </div>
                            <div className="form-group-custom">
                                <label>Raciones</label>
                                <input type="number" placeholder="Ej. 4" value={porciones} onChange={(e) => setPorciones(e.target.value)} />
                            </div>
                            <div className="form-group-custom">
                                <label>Dificultad</label>
                                <select value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
                                    <option value="facil">Fácil 🟢</option>
                                    <option value="media">Media 🟡</option>
                                    <option value="dificil">Difícil 🔴</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label>Foto de Portada (Enlace URL)</label>
                            <input placeholder="Ej. https://enlace-a-tu-imagen.jpg" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-section card-inner">
                        <h3>🛒 Ingredientes Necesarios</h3>
                        <p className="section-helper">Añade los ingredientes uno a uno, indicando la cantidad y unidad.</p>
                        
                        <div className="ingredients-form-list">
                            {ingredients.map((it, idx) => (
                                <IngredientRow
                                    key={idx}
                                    item={it}
                                    onChange={(v) => changeIng(idx, v)}
                                    onRemove={() => removeIng(idx)}
                                />
                            ))}
                        </div>
                        <button type="button" className="btn-add-ingredient" onClick={addIng}>
                            ➕ Añadir otro ingrediente
                        </button>
                    </div>

                    <div className="form-section card-inner">
                        <h3>👩‍🍳 Pasos de Preparación</h3>
                        <p className="section-helper">Escribe cada paso en una línea nueva para que aparezca numerado automáticamente.</p>
                        <div className="form-group-custom">
                            <textarea
                                placeholder="Paso 1: Precalentar el horno a 180ºC...&#10;Paso 2: En una sartén, dorar la cebolla..."
                                value={pasos}
                                onChange={(e) => setPasos(e.target.value)}
                                rows={8}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="primary btn-submit-recipe" type="submit">🚀 Publicar Receta en GustoShare</button>
                    </div>
                </form>
            </div>
        </section>
    );
}


