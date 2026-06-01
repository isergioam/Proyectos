import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallenge } from '../api/challenges';
import { logProgress, getMyProgress } from '../api/progress';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const RegisterProgress = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [progressLogs, setProgressLogs] = useState([]);
  const [value, setValue] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getChallenge(challengeId),
      getMyProgress(challengeId),
    ])
      .then(([challengeRes, progressRes]) => {
        setChallenge(challengeRes.data.data);
        setProgressLogs(progressRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [challengeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await logProgress({
        challenge_id: parseInt(challengeId),
        log_date: logDate,
        value: parseFloat(value),
        note: note || undefined,
      });
      setMessage('Progreso registrado!');
      setValue('');
      setNote('');
      const res = await getMyProgress(challengeId);
      setProgressLogs(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar progreso');
    }
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <button onClick={() => navigate('/my-challenges')} style={{
        background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '1rem',
      }}>
        &larr; Volver a Mis Retos
      </button>

      {challenge && (
        <>
          <h2>Registrar Progreso: {challenge.title}</h2>
          <ProgressBar current={progressLogs.length} total={challenge.duration_days} />
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            {progressLogs.length} / {challenge.duration_days} dias completados
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} style={{
        marginTop: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
      }}>
        {message && <div style={{ color: '#28a745', marginBottom: '0.75rem' }}>{message}</div>}
        {error && <div style={{ color: '#dc3545', marginBottom: '0.75rem' }}>{error}</div>}

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Fecha</label>
          <input
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Valor (ej. minutos, repeticiones)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Nota (opcional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
          />
        </div>
        <button type="submit" style={{
          background: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}>
          Guardar Progreso
        </button>
      </form>

      {progressLogs.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Historial</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Valor</th>
                <th style={thStyle}>Nota</th>
              </tr>
            </thead>
            <tbody>
              {progressLogs.map((log) => (
                <tr key={log.id}>
                  <td style={tdStyle}>{new Date(log.log_date).toLocaleDateString()}</td>
                  <td style={tdStyle}>{log.value}</td>
                  <td style={tdStyle}>{log.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default RegisterProgress;
