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
            
            <div className="panel gameover-premium-panel centered-layout">
                <div className="eyebrow-badge" style={{ color: grade.color, backgroundColor: grade.bg, borderColor: grade.color }}>
                    {grade.title}
                </div>
                
                {/* Centered Large Tombstone */}
                <div className="tombstone-container">
                    <div className="tombstone-body large-tombstone">
                        <div className="tombstone-crack-1"></div>
                        <div className="tombstone-crack-2"></div>
                        <div className="tombstone-crack-3"></div>
                        
                        <h1 className="tombstone-main-title">GAME OVER</h1>
                        
                        <div className="tombstone-photo-frame large-frame">
                            <img src="/assets/player/runner_hit.svg" alt="Duck Debugger RIP" className="tombstone-duck-portrait" />
                        </div>
                        
                        <strong className="tombstone-name large-name">{playerName || 'DuckDebugger'}</strong>
                        <p className="tombstone-epitaph large-epitaph">{epitaph}</p>
                        
                        <div className="tombstone-divider"></div>
                        
                        <div className="tombstone-stats">
                            <div className="tombstone-stat-row">
                                <span className="tombstone-stat-label">PUNTUACIÓN</span>
                                <strong className="tombstone-stat-value">{result.score}</strong>
                            </div>
                            <div className="tombstone-stat-row">
                                <span className="tombstone-stat-label">DISTANCIA</span>
                                <strong className="tombstone-stat-value">{Math.floor(result.distance)} m</strong>
                            </div>
                            <div className="tombstone-stat-row">
                                <span className="tombstone-stat-label">VELOCIDAD</span>
                                <strong className="tombstone-stat-value">x{result.speed.toFixed(1)}</strong>
                            </div>
                        </div>
                        
                        <span className="tombstone-date">2026 - A.D.</span>
                    </div>
                </div>

                {saveMessage && <p className="status-badge success">{saveMessage}</p>}
                {saveError && <p className="status-badge error">{saveError}</p>}

                {/* Bottom Row: Actions */}
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
        </section>
    );
}

export default GameOver;