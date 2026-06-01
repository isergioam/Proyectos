import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyChallenges } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import MainLayout from '../layouts/MainLayout';

const statusColors = {
  active: '#28a745',
  completed: '#007bff',
  abandoned: '#dc3545',
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
      <h2>Mis Retos</h2>
      {error && <div style={{ color: '#dc3545' }}>{error}</div>}
      {challenges.length === 0 ? (
        <p>No estas inscrito en ningun reto. <Link to="/challenges">Ver retos disponibles</Link></p>
      ) : (
        challenges.map((c) => (
          <div key={c.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem' }}>{c.title}</h3>
                <span style={{
                  background: statusColors[c.status] || '#6c757d',
                  color: '#fff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                }}>
                  {c.status}
                </span>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <ProgressBar current={c.days_completed || 0} total={c.duration_days} />
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.25rem 0 0' }}>
                {c.days_completed || 0} / {c.duration_days} dias
              </p>
            </div>
            {c.status === 'active' && (
              <button onClick={() => navigate(`/progress/${c.id}`)} style={{
                marginTop: '0.5rem',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                Registrar Progreso
              </button>
            )}
          </div>
        ))
      )}
    </MainLayout>
  );
};

export default MyChallenges;
