function GameOver({ playerName, result, onRestart, onBackToStart }) {
    return (
        <section className="screen gameover-screen">
            <div className="panel gameover-panel">
                <p className="eyebrow danger">Token expirado</p>
                <h1>Game Over</h1>

                <p className="intro-text">
                    {playerName}, Runner.js se ha comido un error en producción.
                </p>

                <div className="result-grid">
                    <div>
                        <span>Puntuación</span>
                        <strong>{result.score}</strong>
                    </div>

                    <div>
                        <span>Distancia</span>
                        <strong>{Math.floor(result.distance)} m</strong>
                    </div>

                    <div>
                        <span>Velocidad final</span>
                        <strong>x{result.speed.toFixed(1)}</strong>
                    </div>
                </div>

                <div className="actions-row">
                    <button onClick={onRestart}>Volver a correr</button>
                    <button className="secondary-button" onClick={onBackToStart}>
                        Cambiar equipo
                    </button>
                </div>
            </div>
        </section>
    );
}

export default GameOver;