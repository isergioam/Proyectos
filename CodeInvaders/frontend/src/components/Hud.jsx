function Hud({ playerName, score, lives, wave, paused }) {
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
                <span className="hud-label">Vidas</span>
                <strong>{'❤️'.repeat(lives)}</strong>
            </div>

            <div>
                <span className="hud-label">Oleada</span>
                <strong>{wave}</strong>
            </div>

            <div className={paused ? 'pause-pill active' : 'pause-pill'}>
                {paused ? 'Pausa' : 'Jugando'}
            </div>
        </header>
    );
}

export default Hud;