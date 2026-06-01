import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyChallenges } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import MainLayout from '../layouts/MainLayout';

const statusConfig = {
  active: { label: 'Activo', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  completed: { label: 'Completado', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  abandoned: { label: 'Abandonado', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
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
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Mis Retos
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Sigue tu progreso en cada reto</p>
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

      {challenges.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.4, color: '#94a3b8' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>No estás inscrito en ningún reto</p>
          <Link to="/challenges" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            padding: '0.6rem 1.5rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}>
            Ver retos disponibles
          </Link>
        </div>
      ) : (
        challenges.map((c, i) => {
          const st = statusConfig[c.status] || statusConfig.active;
          return (
            <div key={c.id} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              marginBottom: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              animation: 'fadeIn 0.4s ease forwards',
              animationDelay: `${i * 0.05}s`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {c.title}
                  </h3>
                  <span style={{
                    background: st.bg,
                    color: st.color,
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '20px',
                    border: `1px solid ${st.color}20`,
                  }}>
                    {st.label}
                  </span>
                </div>
              </div>

              <ProgressBar current={c.days_completed || 0} total={c.duration_days} />

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                {c.status === 'active' && (
                  <button onClick={() => navigate(`/progress/${c.id}`)} style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                    transition: 'all 0.2s ease',
                  }}>
                    Registrar Progreso
                  </button>
                )}
                <button onClick={() => navigate(`/challenges/${c.id}/ranking`)} style={{
                  background: 'rgba(99,102,241,0.08)',
                  color: '#6366f1',
                  border: '1px solid rgba(99,102,241,0.2)',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}>
                  Ver Ranking
                </button>
              </div>
            </div>
          );
        })
      )}
    </MainLayout>
  );
};

export default MyChallenges;
