function Hud({ playerName, score, distance, speed, paused }) {
    return (
        <header className="hud">
            <div>
                <span className="hud-label">Equipo</span>
                <strong>{playerName}</strong>
            </div>

            <div>
                <span className="hud-label">Puntos</span>
                <strong>{score}</strong>
            </div>

            <div>
                <span className="hud-label">Distancia</span>
                <strong>{Math.floor(distance)} m</strong>
            </div>

            <div>
                <span className="hud-label">Velocidad</span>
                <strong>x{speed.toFixed(1)}</strong>
            </div>

            <div className={paused ? 'pause-pill active' : 'pause-pill'}>
                {paused ? 'Pausa' : 'Corriendo'}
            </div>
        </header>
    );
}

export default Hud;