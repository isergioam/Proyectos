import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRanking } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import styles from './Ranking.module.css';

const medals = ['🥇', '🥈', '🥉'];

const RankBadge = ({ index }) => {
  if (index === 0) return <div className={styles.rankGold}>{medals[0]}</div>;
  if (index === 1) return <div className={styles.rankSilver}>{medals[1]}</div>;
  if (index === 2) return <div className={styles.rankBronze}>{medals[2]}</div>;
  return <div className={styles.rankDefault}>{index + 1}</div>;
};

const Ranking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRanking(id)
      .then((res) => setRanking(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar ranking'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver
      </button>

      <div className={styles.header}>
        <h2 className={styles.title}>Ranking</h2>
        <p className={styles.subtitle}>Clasificación de participantes</p>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {ranking.length === 0 ? (
        <div className={styles.empty}>
          <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          <p className={styles.emptyText}>No hay participantes en este reto.</p>
        </div>
      ) : (
        <div className={styles.card}>
          {ranking.map((row, index) => (
            <div key={row.id} className={`${styles.row} ${index === 0 ? styles.rowHighlight : ''}`}>
              <RankBadge index={index} />
              <div className={styles.userInfo}>
                <p className={styles.userName}>{row.username}</p>
                <p className={styles.userDays}>{row.days_completed} días completados</p>
              </div>
              <div className={styles.score}>
                <p className={styles.scoreValue} style={{ color: index === 0 ? '#f59e0b' : '#6366f1' }}>
                  {row.total_progress}
                </p>
                <p className={styles.scoreLabel}>Puntos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Ranking;
