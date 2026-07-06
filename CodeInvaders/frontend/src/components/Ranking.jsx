import { useEffect, useState } from 'react';
import { getScores } from '../services/api';

function Ranking({ onBack }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadScores();
    }, []);

    async function loadScores() {
        try {
            setLoading(true);
            setError('');
            const data = await getScores();
            setScores(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="screen ranking-screen">
            <div className="panel ranking-panel">
                <p className="eyebrow">Clasificación</p>
                <h1>Ranking</h1>
                <p className="intro-text">
                    Los mejores equipos del aula. Aquí no se juzga a nadie, salvo por sus puntos.
                </p>

                {loading && <p className="status-text">Cargando ranking...</p>}
                {error && <p className="status-text error-text">{error}</p>}

                {!loading && !error && scores.length === 0 && (
                    <p className="empty-ranking">Todavía no hay puntuaciones guardadas.</p>
                )}

                {!loading && !error && scores.length > 0 && (
                    <div className="ranking-table-wrapper">
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Equipo</th>
                                    <th>Puntos</th>
                                    <th>Oleada</th>
                                    <th>Fecha</th>
                                    <th>Duración</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((score, index) => (
                                    <tr key={score.id}>
                                        <td>{index + 1}</td>
                                        <td>{score.playerName}</td>
                                        <td>{score.score}</td>
                                        <td>{score.wave}</td>
                                        <td>{formatDate(score.createdAt)}</td>
                                        <td>{score.duration ?? 0}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="actions-row">
                    <button onClick={onBack}>Volver</button>
                    <button className="secondary-button" onClick={loadScores}>Actualizar</button>
                </div>
            </div>
        </section>
    );
}

function formatDate(value) {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
}

export default Ranking;