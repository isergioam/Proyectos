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
        <section className="card">
            <h2>Crear receta</h2>

            {error && <p className="error">❌ {error}</p>}
            {ok && <p className="ok">{ok}</p>}

            <form onSubmit={onSubmit} className="form">
                <h3>Autor</h3>
                <div className="row2">
                    <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <h3>Receta</h3>
                <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                <input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

                <div className="row3">
                    <input placeholder="Tiempo (min)" value={tiempoMin} onChange={(e) => setTiempoMin(e.target.value)} />
                    <input placeholder="Porciones" value={porciones} onChange={(e) => setPorciones(e.target.value)} />
                    <select value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
                        <option value="facil">facil</option>
                        <option value="media">media</option>
                        <option value="dificil">dificil</option>
                    </select>
                </div>

                <input placeholder="Foto URL (opcional)" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />

                <textarea
                    placeholder="Pasos (texto largo)"
                    value={pasos}
                    onChange={(e) => setPasos(e.target.value)}
                    rows={8}
                />

                <h3>Ingredientes</h3>
                {ingredients.map((it, idx) => (
                    <IngredientRow
                        key={idx}
                        item={it}
                        onChange={(v) => changeIng(idx, v)}
                        onRemove={() => removeIng(idx)}
                    />
                ))}
                <button type="button" onClick={addIng}>+ Añadir ingrediente</button>

                <button className="primary" type="submit">Crear</button>
            </form>
        </section>
    );
}


