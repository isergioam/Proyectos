import { Link } from 'react-router-dom';
import styles from './ChallengeCard.module.css';

const difficultyConfig = {
  facil: { label: 'Fácil', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  intermedio: { label: 'Intermedio', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  dificil: { label: 'Difícil', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
};

const ChallengeCard = ({ challenge }) => {
  const diff = difficultyConfig[challenge.difficulty] || difficultyConfig.facil;
  const imgUrl = challenge.image || `https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=400&fit=crop`;

  return (
    <Link to={`/challenges/${challenge.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.cardImg}
          src={imgUrl}
          alt={challenge.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className={styles.imgFallback}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <div className={styles.overlay} />
        <div className={styles.badgeRow}>
          <span className={styles.badge} style={{
            background: diff.bg,
            color: diff.color,
            borderColor: diff.border,
          }}>
            {diff.label}
          </span>
        </div>
        <div className={styles.bottomBadge}>
          <span className={styles.durationBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {challenge.duration_days} días
          </span>
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{challenge.title}</h3>
        <p className={styles.description}>{challenge.description}</p>
      </div>
    </Link>
  );
};

export default ChallengeCard;
