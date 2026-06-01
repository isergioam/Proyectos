import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallenge } from '../api/challenges';
import { logProgress, getMyProgress } from '../api/progress';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '0.9rem',
  color: '#1e293b',
  background: '#fff',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.35rem',
  color: '#475569',
  fontSize: '0.85rem',
  fontWeight: '600',
};

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
  const [saving, setSaving] = useState(false);

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
    setSaving(true);

    try {
      await logProgress({
        challenge_id: parseInt(challengeId),
        log_date: logDate,
        value: parseFloat(value),
        note: note || undefined,
      });
      setMessage('Progreso registrado correctamente');
      setValue('');
      setNote('');
      const res = await getMyProgress(challengeId);
      setProgressLogs(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar progreso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <button onClick={() => navigate('/my-challenges')} style={{
        background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer',
        marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500',
        display: 'flex', alignItems: 'center', gap: '0.35rem',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver a Mis Retos
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          {challenge?.title || 'Registrar Progreso'}
        </h2>
        {challenge && (
          <div style={{ marginBottom: '0.5rem' }}>
            <ProgressBar current={progressLogs.length} total={challenge.duration_days} />
          </div>
        )}
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>
          Nuevo Registro
        </h3>

        <form onSubmit={handleSubmit}>
          {message && (
            <div style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.15)',
              color: '#10b981',
              padding: '0.6rem 0.9rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}>{message}</div>
          )}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Fecha</label>
            <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Valor (ej. minutos, repeticiones)</label>
            <input type="number" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} required placeholder="0" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Nota (opcional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
              placeholder="¿Cómo te fue hoy?" />
          </div>
          <button type="submit" disabled={saving} style={{
            background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            border: 'none',
            padding: '0.65rem 2rem',
            borderRadius: '10px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: saving ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
            transition: 'all 0.2s ease',
          }}>
            {saving ? 'Guardando...' : 'Guardar Progreso'}
          </button>
        </form>
      </div>

      {progressLogs.length > 0 && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Historial</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Fecha</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Valor</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {progressLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', color: '#1e293b' }}>
                      {new Date(log.log_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.75rem 1.5rem', fontWeight: '600', color: '#6366f1' }}>
                      {log.value}
                    </td>
                    <td style={{ padding: '0.75rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {log.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default RegisterProgress;
