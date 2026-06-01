import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRanking } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const medals = ['🥇', '🥈', '🥉'];

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
      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer',
        marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500',
        display: 'flex', alignItems: 'center', gap: '0.35rem',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Ranking
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Clasificación de participantes</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.15)',
          color: '#ef4444',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
        }}>{error}</div>
      )}

      {ranking.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.4, color: '#94a3b8' }}>
            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          <p style={{ color: '#94a3b8' }}>No hay participantes en este reto.</p>
        </div>
      ) : (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {ranking.map((row, index) => (
            <div key={row.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: index < ranking.length - 1 ? '1px solid #f1f5f9' : 'none',
              background: index === 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(245,158,11,0.01))' : 'transparent',
              transition: 'background 0.2s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index === 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(245,158,11,0.01))' : 'transparent';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: index < 3 ? '1.2rem' : '0.9rem',
                background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                           index === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                           index === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' : '#f1f5f9',
                color: index < 3 ? '#fff' : '#94a3b8',
                marginRight: '1rem',
                flexShrink: 0,
              }}>
                {index < 3 ? medals[index] : index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e293b', marginBottom: '0.15rem' }}>
                  {row.username}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                  {row.days_completed} días completados
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  color: index === 0 ? '#f59e0b' : '#6366f1',
                  margin: 0,
                }}>
                  {row.total_progress}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0.1rem 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Puntos
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Ranking;
