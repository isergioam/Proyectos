import { useState } from 'react';

function StartScreen({ onStart, onShowRanking, config }) {
    const [playerName, setPlayerName] = useState('');
    const [difficulty, setDifficulty] = useState('normal');

    function handleSubmit(event) {
        event.preventDefault();

        const cleanName = playerName.trim();

        if (!cleanName) {
            return;
        }

        onStart(cleanName, difficulty);
    }

    return (
        <section className="screen start-screen">
            <div className="panel intro-panel">
                <p className="eyebrow">Arcade FullStack</p>
                <h1>{config?.title || 'Code Invaders'}</h1>
                <h2>{config?.subtitle || 'La invasión de los bugs'}</h2>

                <p className="intro-text">
                    Pilota la nave Debugger-1, destruye bugs, esquiva errores y sobrevive
                    a las oleadas del servidor maldito.
                </p>

                {config?.difficulties?.[difficulty] && (
                    <p className="difficulty-box">
                        <strong>Dificultad seleccionada:</strong> {config.difficulties[difficulty].label} (Velocidad: {config.difficulties[difficulty].enemySpeedMultiplier}x, Aparición: {config.difficulties[difficulty].spawnMultiplier}x)
                    </p>
                )}

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

                    <label htmlFor="difficulty">Dificultad</label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(event) => setDifficulty(event.target.value)}
                    >
                        {Object.entries(config?.difficulties || {}).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.label}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Empezar partida</button>
                </form>

                <button className="link-button" onClick={onShowRanking}>
                    Ver ranking
                </button>

                <div className="controls-box">
                    <h3>Controles e Instrucciones</h3>
                    <p><strong>Teclado:</strong></p>
                    <p>• <strong>WASD / Flechas</strong>: mover nave</p>
                    <p>• <strong>Espacio</strong>: disparar (mantén pulsado para ráfaga continua)</p>
                    <p>• <strong>P</strong>: pausar o continuar</p>
                    <p style={{ marginTop: '10px', color: '#22d3ee' }}>
                        <strong>Móvil:</strong> Usa la cruceta virtual (D-Pad) para moverte y el botón de DISPARO.
                    </p>
                    <p style={{ marginTop: '12px', color: '#fb7185', fontSize: '13px', fontWeight: 'bold' }}>
                        ⚠️ ¡Cuidado! Los bugs disparan excepciones destructivas de color rojo.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default StartScreen;