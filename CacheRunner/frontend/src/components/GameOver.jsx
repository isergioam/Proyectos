function GameOver({
    playerName,
    result,
    saving,
    alreadySaved,
    saveMessage,
    saveError,
    onSaveScore,
    onRestart,
    onBackToStart,
    onShowRanking
}) {
    return (
        <section className="screen gameover-screen">
            <div className="panel gameover-panel">
                <p className="eyebrow danger">Token expirado</p>
                <h1>Game Over</h1>

                <p className="intro-text">
                    ¡Oh no, {playerName}! DuckDebugger.js se ha estrellado contra un error en producción y ha dejado de responder.
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

                {saveMessage && <p className="status-text success-text">{saveMessage}</p>}
                {saveError && <p className="status-text error-text">{saveError}</p>}

                <div className="actions-row">
                    <button onClick={onSaveScore} disabled={saving || alreadySaved}>
                        {alreadySaved ? 'Puntuación guardada' : saving ? 'Guardando...' : 'Guardar puntuación'}
                    </button>

                    <button className="secondary-button" onClick={onRestart}>
                        Volver a correr
                    </button>

                    <button className="secondary-button" onClick={onShowRanking}>
                        Ver ranking
                    </button>

                    <button className="secondary-button" onClick={onBackToStart}>
                        Cambiar equipo
                    </button>
                </div>
            </div>
        </section>
    );
}

export default GameOver;