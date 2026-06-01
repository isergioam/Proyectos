import { useState, useEffect } from 'react';
import { getChallenges } from '../api/challenges';
import ChallengeCard from '../components/ChallengeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import styles from './ChallengeCatalog.module.css';

const difficulties = [
  { value: '', label: 'Todos', color: '#6366f1' },
  { value: 'facil', label: 'Fácil', color: '#10b981' },
  { value: 'intermedio', label: 'Intermedio', color: '#f59e0b' },
  { value: 'dificil', label: 'Difícil', color: '#ef4444' },
];

const ChallengeCatalog = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getChallenges()
      .then((res) => setChallenges(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar retos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? challenges.filter((c) => c.difficulty === filter)
    : challenges;

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>{challenges.length} retos disponibles</span>
          <h1 className={styles.heroTitle}>Desafíate a ti mismo</h1>
          <p className={styles.heroDesc}>
            Supera retos diarios, construye hábitos saludables y compite con otros en rankings.
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        {difficulties.map((d) => (
          <button
            key={d.value}
            onClick={() => setFilter(d.value)}
            className={`${styles.filterBtn} ${filter === d.value ? styles.filterBtnActive : ''}`}
            style={filter === d.value ? {
              background: `${d.color}15`,
              color: d.color,
              borderColor: `${d.color}30`,
            } : {}}
          >
            {d.label}
          </button>
        ))}
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <svg className={styles.emptyIcon} width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p className={styles.emptyText}>No hay retos con ese filtro.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((challenge, i) => (
            <div key={challenge.id} className={styles.cardWrapper} style={{ animationDelay: `${i * 0.07}s` }}>
              <ChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default ChallengeCatalog;
