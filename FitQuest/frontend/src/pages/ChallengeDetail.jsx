import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallenge, joinChallenge, leaveChallenge } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import useAuth from '../hooks/useAuth';

const difficultyConfig = {
  facil: { label: 'Fácil', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  intermedio: { label: 'Intermedio', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  dificil: { label: 'Difícil', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const btnBase = {
  border: 'none',
  padding: '0.6rem 1.5rem',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '600',
  transition: 'all 0.2s ease',
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    getChallenge(id)
      .then((res) => setChallenge(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar reto'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    setActioning(true);
    try {
      const res = await joinChallenge(id);
      setActionMsg(res.data.message || 'Te has inscrito al reto!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al unirse');
    } finally {
      setActioning(false);
    }
  };

  const handleLeave = async () => {
    setActioning(true);
    try {
      const res = await leaveChallenge(id);
      setActionMsg(res.data.message || 'Has abandonado el reto');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al abandonar');
    } finally {
      setActioning(false);
    }
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  if (!challenge) {
    return <MainLayout><p>Reto no encontrado</p></MainLayout>;
  }

  const diff = difficultyConfig[challenge.difficulty] || difficultyConfig.facil;

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} style={{
        background: 'none',
        border: 'none',
        color: '#6366f1',
        cursor: 'pointer',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.3rem 0',
        transition: 'gap 0.2s ease',
      }}
        onMouseEnter={(e) => e.currentTarget.style.gap = '0.6rem'}
        onMouseLeave={(e) => e.currentTarget.style.gap = '0.35rem'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver
      </button>

      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        animation: 'fadeIn 0.4s ease forwards',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {challenge.title}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: diff.bg,
                color: diff.color,
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
              }}>
                {diff.label}
              </span>
              <span style={{
                background: 'rgba(99,102,241,0.08)',
                color: '#6366f1',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
              }}>
                {challenge.duration_days} días
              </span>
            </div>
          </div>
        </div>

        <p style={{
          color: '#475569',
          fontSize: '0.95rem',
          lineHeight: '1.7',
          marginBottom: '1.5rem',
        }}>
          {challenge.description}
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.15)',
            color: '#ef4444',
            padding: '0.6rem 0.9rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>{error}</div>
        )}
        {actionMsg && (
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
            color: '#10b981',
            padding: '0.6rem 0.9rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>{actionMsg}</div>
        )}

        {user && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleJoin} disabled={actioning} style={{
              ...btnBase,
              background: actioning ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              boxShadow: actioning ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
            }}>
              {actioning ? 'Procesando...' : 'Unirse al Reto'}
            </button>
            <button onClick={handleLeave} disabled={actioning} style={{
              ...btnBase,
              background: 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              Abandonar Reto
            </button>
            <button onClick={() => navigate(`/challenges/${id}/ranking`)} style={{
              ...btnBase,
              background: 'rgba(99,102,241,0.08)',
              color: '#6366f1',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              Ver Ranking
            </button>
          </div>
        )}

        {!user && (
          <div style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.12)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            textAlign: 'center',
          }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              <a href="/login" style={{ color: '#6366f1', fontWeight: '600' }}>Inicia sesión</a> para unirte a este reto
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ChallengeDetail;
