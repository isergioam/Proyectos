import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRanking } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

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
        background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '1rem',
      }}>
        &larr; Volver
      </button>

      <h2>Ranking</h2>
      {error && <div style={{ color: '#dc3545' }}>{error}</div>}
      {ranking.length === 0 ? (
        <p>No hay participantes en este reto.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Dias Completados</th>
              <th style={thStyle}>Progreso Total</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((row, index) => (
              <tr key={row.id} style={{ background: index === 0 ? '#fff3cd' : 'transparent' }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{row.username}</td>
                <td style={tdStyle}>{row.days_completed}</td>
                <td style={tdStyle}>{row.total_progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
};

const thStyle = {
  border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd', padding: '0.5rem',
};

export default Ranking;
