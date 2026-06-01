import { useState, useEffect } from 'react';
import { getChallenges, createChallenge, updateChallenge, deleteChallenge, getParticipants } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import styles from './AdminPanel.module.css';

const emptyForm = { title: '', description: '', duration_days: '', difficulty: 'facil', image: '' };

const AdminPanel = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const loadChallenges = () => {
    getChallenges()
      .then((res) => setChallenges(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadChallenges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      if (editingId) { await updateChallenge(editingId, form); setMessage('Reto actualizado correctamente'); }
      else { await createChallenge(form); setMessage('Reto creado correctamente'); }
      setForm(emptyForm); setEditingId(null); loadChallenges();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar'); }
  };

  const handleEdit = (challenge) => {
    setForm({
      title: challenge.title, description: challenge.description || '',
      duration_days: challenge.duration_days.toString(), difficulty: challenge.difficulty, image: challenge.image || '',
    });
    setEditingId(challenge.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro de eliminar este reto?')) return;
    try { await deleteChallenge(id); setMessage('Reto eliminado'); loadChallenges(); }
    catch (err) { setError(err.response?.data?.message || 'Error al eliminar'); }
  };

  const loadParticipants = async (challengeId) => {
    if (!challengeId) { setParticipants([]); return; }
    setParticipantsLoading(true);
    try {
      const res = await getParticipants(challengeId);
      setParticipants(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar participantes');
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChallenge) loadParticipants(selectedChallenge);
  }, [selectedChallenge]);

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <h2 className={styles.title}>Panel de Administración</h2>

      <div className={styles.formCard}>
        <h3 className={styles.formHeading}>{editingId ? 'Editar Reto' : 'Crear Nuevo Reto'}</h3>
        {message && <div className={styles.msgSuccess}>{message}</div>}
        {error && <div className={styles.msgError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Título</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={styles.textarea} />
          </div>
          <div className={styles.formRow}>
            <div>
              <label className={styles.label}>Duración (días)</label>
              <input type="number" min="1" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} required className={styles.input} />
            </div>
            <div>
              <label className={styles.label}>Dificultad</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={styles.select}>
                <option value="facil">Fácil</option>
                <option value="intermedio">Intermedio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Imagen URL (opcional)</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={styles.input} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className={styles.submitBtn}>{editingId ? 'Actualizar' : 'Crear Reto'}</button>
            {editingId && <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }} className={styles.cancelBtn}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Retos Existentes ({challenges.length})</h3>
        </div>
        {challenges.length === 0 ? (
          <div className={styles.emptyTable}>No hay retos creados.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Título</th>
                  <th className={styles.th}>Días</th>
                  <th className={styles.th}>Dificultad</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c.id} className={styles.tr}>
                    <td className={styles.td}>{c.id}</td>
                    <td className={styles.td} style={{ fontWeight: 500 }}>{c.title}</td>
                    <td className={styles.td}>{c.duration_days}</td>
                    <td className={styles.td}>{c.difficulty}</td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <button onClick={() => handleEdit(c)} className={styles.editBtn}>Editar</button>
                      <button onClick={() => handleDelete(c.id)} className={styles.deleteBtn}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Revisar Participantes</h3>
        </div>
        <div className={styles.selectWrap}>
          <select
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
            className={styles.select}
          >
            <option value="">Seleccionar un reto...</option>
            {challenges.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        {selectedChallenge && (
          participantsLoading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Cargando participantes...</div> :
          participants.length === 0 ? (
            <div className={styles.emptyTable}>No hay participantes en este reto.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Usuario</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Estado</th>
                    <th className={styles.th}>Días Completados</th>
                    <th className={styles.th}>Fecha Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id} className={styles.tr}>
                      <td className={styles.td} style={{ fontWeight: 500 }}>{p.username}</td>
                      <td className={styles.td}>{p.email}</td>
                      <td className={styles.td}>
                        <span style={{
                          color: p.status === 'active' ? '#10b981' : p.status === 'completed' ? '#6366f1' : '#ef4444',
                          fontWeight: 600, textTransform: 'capitalize',
                        }}>{p.status}</span>
                      </td>
                      <td className={styles.td}>{p.days_completed}</td>
                      <td className={styles.td}>{new Date(p.joined_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
