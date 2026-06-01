import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallenge, joinChallenge, leaveChallenge } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import useAuth from '../hooks/useAuth';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    getChallenge(id)
      .then((res) => setChallenge(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar reto'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    try {
      const res = await joinChallenge(id);
      setActionMsg(res.data.message || 'Te has inscrito al reto!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al unirse');
    }
  };

  const handleLeave = async () => {
    try {
      const res = await leaveChallenge(id);
      setActionMsg(res.data.message || 'Has abandonado el reto');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al abandonar');
    }
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  if (!challenge) {
    return <MainLayout><p>Reto no encontrado</p></MainLayout>;
  }

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} style={{
        background: 'none',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        marginBottom: '1rem',
      }}>
        &larr; Volver
      </button>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
        <h2>{challenge.title}</h2>
        <p style={{ color: '#666' }}>{challenge.description}</p>
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Duracion:</strong> {challenge.duration_days} dias</p>
          <p><strong>Dificultad:</strong> {challenge.difficulty}</p>
        </div>

        {error && <div style={{ color: '#dc3545', marginTop: '0.5rem' }}>{error}</div>}
        {actionMsg && <div style={{ color: '#28a745', marginTop: '0.5rem' }}>{actionMsg}</div>}

        {user && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleJoin} style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              Unirse al Reto
            </button>
            <button onClick={handleLeave} style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              Abandonar Reto
            </button>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate(`/challenges/${id}/ranking`)} style={{
            background: '#6c757d',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Ver Ranking
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChallengeDetail;
