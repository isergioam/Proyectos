import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyChallenges } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import MainLayout from '../layouts/MainLayout';
import styles from './MyChallenges.module.css';

const statusConfig = {
  active: { label: 'Activo', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  completed: { label: 'Completado', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  abandoned: { label: 'Abandonado', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const MyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMyChallenges()
      .then((res) => setChallenges(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar retos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>{challenges.length} retos activos</span>
          <h1 className={styles.heroTitle}>Mis Retos</h1>
          <p className={styles.heroDesc}>Sigue tu progreso, registra avances y alcanza tus metas.</p>
        </div>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {challenges.length === 0 ? (
        <div className={styles.empty}>
          <svg className={styles.emptyIcon} width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p className={styles.emptyText}>No estás inscrito en ningún reto todavía</p>
          <Link to="/challenges" className={styles.exploreBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Explorar Retos
          </Link>
        </div>
      ) : (
        challenges.map((c, i) => {
          const st = statusConfig[c.status] || statusConfig.active;
          const imgUrl = c.image || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=300&fit=crop';
          return (
            <div key={c.id} className={styles.card} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className={styles.imageWrap}>
                <img src={imgUrl} alt={c.title} onError={(e) => { e.target.style.display = 'none'; }} />
                <span className={styles.statusBadge} style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
                  {st.label}
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <ProgressBar current={c.days_completed || 0} total={c.duration_days} />
                <div className={styles.actions}>
                  {c.status === 'active' && (
                    <button onClick={() => navigate(`/progress/${c.id}`)} className={styles.progressBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Registrar Progreso
                    </button>
                  )}
                  <button onClick={() => navigate(`/challenges/${c.id}/ranking`)} className={styles.rankingBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Ranking
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </MainLayout>
  );
};

export default MyChallenges;
