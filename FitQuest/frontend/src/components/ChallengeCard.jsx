import { Link } from 'react-router-dom';

const difficultyConfig = {
  facil: { label: 'Fácil', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  intermedio: { label: 'Intermedio', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  dificil: { label: 'Difícil', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const ChallengeCard = ({ challenge }) => {
  const diff = difficultyConfig[challenge.difficulty] || difficultyConfig.facil;

  return (
    <Link to={`/challenges/${challenge.id}`} style={{
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      padding: '1.5rem',
      marginBottom: '1rem',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.12)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          {challenge.title}
        </h3>
        <span style={{
          background: diff.bg,
          color: diff.color,
          fontSize: '0.75rem',
          fontWeight: '600',
          padding: '0.2rem 0.65rem',
          borderRadius: '20px',
          whiteSpace: 'nowrap',
          border: `1px solid ${diff.color}20`,
        }}>
          {diff.label}
        </span>
      </div>
      <p style={{
        color: '#64748b',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        margin: '0 0 1rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {challenge.description}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f1f5f9',
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          fontWeight: '500',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {challenge.duration_days} días
        </span>
        <span style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8rem',
          color: '#6366f1',
          fontWeight: '600',
        }}>
          Ver detalle
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default ChallengeCard;
