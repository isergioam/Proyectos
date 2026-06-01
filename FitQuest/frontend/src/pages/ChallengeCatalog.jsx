import { useState, useEffect } from 'react';
import { getChallenges } from '../api/challenges';
import ChallengeCard from '../components/ChallengeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const ChallengeCatalog = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getChallenges()
      .then((res) => setChallenges(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar retos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          marginBottom: '0.35rem',
        }}>
          Catálogo de Retos
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Encuentra el reto perfecto para superar tus límites
        </p>
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
        }}>
          {error}
        </div>
      )}

      {challenges.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#94a3b8',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.5 }}>
            <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <p>No hay retos disponibles.</p>
        </div>
      ) : (
        <div style={{ animation: 'slideUp 0.5s ease forwards' }}>
          {challenges.map((challenge, i) => (
            <div key={challenge.id} style={{ animation: `fadeIn 0.4s ease forwards`, animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              <ChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default ChallengeCatalog;
