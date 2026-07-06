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
                <p className="eyebrow">Arcade FullStack</p>
                <h1>Code Invaders</h1>
                <h2>La invasión de los bugs</h2>

                <p className="intro-text">
                    Pilota la nave Debugger-1, destruye bugs, esquiva errores y sobrevive
                    a las oleadas del servidor maldito.
                </p>

                <form className="start-form" onSubmit={handleSubmit}>
                    <label htmlFor="playerName">Nombre del equipo</label>
                    <input
                        id="playerName"
                        type="text"
                        value={playerName}
                        maxLength="24"
                        placeholder="Ej: Equipo NaN"
                        onChange={(event) => setPlayerName(event.target.value)}
                    />

                    <button type="submit">Empezar partida</button>
                </form>

                <div className="controls-box">
                    <h3>Controles</h3>
                    <p><strong>WASD</strong> o <strong>flechas</strong>: mover nave</p>
                    <p><strong>Espacio</strong>: disparar</p>
                    <p><strong>P</strong>: pausar o continuar</p>
                </div>
            </div>
        </section>
    );
}

export default StartScreen;