import { useState } from 'react';

function StartScreen({ onStart }) {
    const [playerName, setPlayerName] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        const cleanName = playerName.trim();

        if (!cleanName) {
            return;
        }

        onStart(cleanName);
    }

    return (
        <section className="screen start-screen">
            <div className="panel intro-panel">
                <p className="eyebrow">Endless Runner Visual</p>
                <h1>Cache Runner</h1>
                <h2>Corre antes de que expire el token</h2>

                <p className="intro-text">
                    Runner.js atraviesa un pipeline digital lleno de errores, paquetes rotos
                    y procesos zombis. Salta, sobrevive y consigue la mayor distancia.
                </p>

                <form className="start-form" onSubmit={handleSubmit}>
                    <label htmlFor="playerName">Nombre del equipo</label>
                    <input
                        id="playerName"
                        type="text"
                        value={playerName}
                        maxLength="24"
                        placeholder="Ej: Los Async"
                        onChange={(event) => setPlayerName(event.target.value)}
                    />

                    <button type="submit">Empezar carrera</button>
                </form>

                <div className="controls-box">
                    <h3>Controles</h3>
                    <p><strong>Espacio</strong>, <strong>W</strong> o <strong>flecha arriba</strong>: saltar</p>
                    <p><strong>P</strong>: pausar o continuar</p>
                </div>
            </div>
        </section>
    );
}

export default StartScreen;