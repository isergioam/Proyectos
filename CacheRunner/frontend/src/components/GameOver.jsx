import React, { useState } from 'react';

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
    // Get grade classification based on score
    const getGrade = (score) => {
        if (score >= 5000) return { title: '👑 SYSTEM ADMINISTRATOR (PRO)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
        if (score >= 2000) return { title: '🛡️ SENIOR DEBUGGER', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
        if (score >= 800) return { title: '💻 JUNIOR DEVELOPER', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
        return { title: '🐛 INTERN BUG HUNTER', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' };
    };

    const grade = getGrade(result.score);

    // Pick a random funny developer epitaph
    const [epitaph] = useState(() => {
        const messages = [
            "\"¡Pero si en mi máquina funcionaba!\"",
            "Expiró en producción tras un merge directo a master.",
            "Falleció intentando borrar recursivamente node_modules.",
            "Víctima de un desbordamiento de pila (Stack Overflow) crítico.",
            "Descanse en paz en el servidor de AWS us-east-1.",
            "Se ahogó en un mar de promesas sin resolver (.then sin .catch).",
            "Su recolector de basura lo marcó como inalcanzable y lo liberó.",
            "Partió a depurar un bucle infinito en el gran servidor central.",
            "Intentó hacer un deploy manual un viernes a las 17:59."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    });

    return (
        <section className="screen gameover-screen-wrapper">
            <div className="decor-orb orb-1"></div>
            <div className="decor-orb orb-2"></div>
            
            <div className="panel gameover-premium-panel">
                <div className="gameover-layout-columns">
                    
                    {/* Left Column: Tombstone */}
                    <div className="tombstone-col">
                        <div className="tombstone-body">
                            <div className="tombstone-crack-1"></div>
                            <div className="tombstone-crack-2"></div>
                            
                            <span className="tombstone-rip">R. I. P.</span>
                            
                            <div className="tombstone-photo-frame">
                                <img src="/assets/player/runner_hit.svg" alt="Duck Debugger RIP" className="tombstone-duck-portrait" />
                            </div>
                            
                            <strong className="tombstone-name">{playerName || 'DuckDebugger'}</strong>
                            <p className="tombstone-epitaph">{epitaph}</p>
                            
                            <span className="tombstone-date">2026 - A.D.</span>
                        </div>
                    </div>
                    
                    {/* Right Column: Game Stats and Actions */}
                    <div className="gameover-content-col">
                        <div className="eyebrow-badge" style={{ color: grade.color, backgroundColor: grade.bg, borderColor: grade.color }}>
                            {grade.title}
                        </div>
                        
                        <h1 className="gameover-title">GAME OVER</h1>
                        <p className="gameover-intro">
                            El sistema ha sufrido una parada inesperada por un error irrecuperable.
                        </p>

                        <div className="premium-result-grid">
                            <div className="result-card card-score">
                                <div className="icon-wrapper">
                                    <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="8" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" />
                                        <path d="M12 8v8M9 12h6" stroke="#f59e0b" />
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <span>Puntuación</span>
                                    <strong>{result.score}</strong>
                                </div>
                            </div>

                            <div className="result-card card-distance">
                                <div className="icon-wrapper">
                                    <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 12h18M3 6h18M3 18h18" stroke="#38bdf8" />
                                        <path d="M8 3v18M16 3v18" stroke="#38bdf8" strokeDasharray="3 3" />
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <span>Distancia</span>
                                    <strong>{Math.floor(result.distance)} <small>m</small></strong>
                                </div>
                            </div>

                            <div className="result-card card-speed">
                                <div className="icon-wrapper">
                                    <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" />
                                    </svg>
                                </div>
                                <div className="card-info">
                                    <span>Velocidad final</span>
                                    <strong>x{result.speed.toFixed(1)}</strong>
                                </div>
                            </div>
                        </div>

                        {saveMessage && <p className="status-badge success">{saveMessage}</p>}
                        {saveError && <p className="status-badge error">{saveError}</p>}

                        <div className="premium-actions-row">
                            <button className="btn-primary" onClick={onSaveScore} disabled={saving || alreadySaved}>
                                {alreadySaved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar Puntuación'}
                            </button>

                            <button className="btn-secondary" onClick={onRestart}>
                                Volver a Correr
                            </button>

                            <button className="btn-secondary" onClick={onShowRanking}>
                                Ver Ranking
                            </button>

                            <button className="btn-secondary" onClick={onBackToStart}>
                                Cambiar Nombre
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}

export default GameOver;