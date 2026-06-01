import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChallenge } from '../api/challenges';
import { logProgress, getMyProgress } from '../api/progress';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import styles from './RegisterProgress.module.css';

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
    Promise.all([getChallenge(challengeId), getMyProgress(challengeId)])
      .then(([challengeRes, progressRes]) => {
        setChallenge(challengeRes.data.data);
        setProgressLogs(progressRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [challengeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError(''); setSaving(true);
    try {
      await logProgress({ challenge_id: parseInt(challengeId), log_date: logDate, value: parseFloat(value), note: note || undefined });
      setMessage('Progreso registrado correctamente');
      setValue(''); setNote('');
      const res = await getMyProgress(challengeId);
      setProgressLogs(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar progreso');
    } finally { setSaving(false); }
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <button onClick={() => navigate('/my-challenges')} className={styles.backBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver a Mis Retos
      </button>

      {challenge && (
        <div className={styles.challengeHeader}>
          <div className={styles.challengeGlow} />
          <div className={styles.challengeHeaderContent}>
            <h2 className={styles.challengeTitle}>{challenge.title}</h2>
            <p className={styles.challengeSub}>Registra tu progreso diario</p>
            <ProgressBar current={progressLogs.length} total={challenge.duration_days} />
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Nuevo Registro</h3>
          <form onSubmit={handleSubmit}>
            {message && <div className={styles.msgSuccess}>{message}</div>}
            {error && <div className={styles.msgError}>{error}</div>}
            <div className={styles.formGroup}>
              <label className={styles.label}>Fecha</label>
              <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Valor</label>
              <input type="number" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)}
                required placeholder="Ej: 30 (minutos, repeticiones...)" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nota (opcional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                className={styles.textarea} placeholder="¿Cómo te fue hoy?" />
            </div>
            <button type="submit" disabled={saving} className={styles.saveBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {saving ? 'Guardando...' : 'Guardar Progreso'}
            </button>
          </form>
        </div>

        {progressLogs.length > 0 && (
          <div className={styles.historyCard}>
            <div className={styles.historyHeader}>
              <h3 className={styles.historyTitle}>Historial</h3>
            </div>
            <div className={styles.historyList}>
              {progressLogs.map((log) => (
                <div key={log.id} className={styles.historyItem}>
                  <div>
                    <p className={styles.historyDate}>
                      {new Date(log.log_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {log.note && <p className={styles.historyNote}>{log.note}</p>}
                  </div>
                  <span className={styles.historyValue}>{log.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RegisterProgress;
