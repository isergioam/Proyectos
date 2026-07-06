function GameOver({ playerName, result, onRestart, onBackToStart }) {
    return (
        <section className="screen gameover-screen">
            <div className="panel gameover-panel">
                <p className="eyebrow danger">Servidor comprometido</p>
                <h1>Game Over</h1>

                <p className="intro-text">
                    {playerName}, los bugs han ganado esta batalla. Pero el servidor aún puede salvarse.
                </p>

                <div className="result-grid">
                    <div>
                        <span>Puntuación</span>
                        <strong>{result.score}</strong>
                    </div>

                    <div>
                        <span>Oleada alcanzada</span>
                        <strong>{result.wave}</strong>
                    </div>
                </div>

                <div className="actions-row">
                    <button onClick={onRestart}>Volver a jugar</button>
                    <button className="secondary-button" onClick={onBackToStart}>
                        Cambiar equipo
                    </button>
                </div>
            </div>
        </section>
    );
}

export default GameOver;