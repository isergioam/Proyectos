import { useState, useEffect } from 'react';
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const emptyForm = { title: '', description: '', duration_days: '', difficulty: 'facil', image: '' };

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '0.9rem',
  color: '#1e293b',
  background: '#fff',
};

const AdminPanel = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadChallenges = () => {
    getChallenges()
      .then((res) => setChallenges(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadChallenges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        await updateChallenge(editingId, form);
        setMessage('Reto actualizado correctamente');
      } else {
        await createChallenge(form);
        setMessage('Reto creado correctamente');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadChallenges();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEdit = (challenge) => {
    setForm({
      title: challenge.title,
      description: challenge.description || '',
      duration_days: challenge.duration_days.toString(),
      difficulty: challenge.difficulty,
      image: challenge.image || '',
    });
    setEditingId(challenge.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro de eliminar este reto?')) return;
    try {
      await deleteChallenge(id);
      setMessage('Reto eliminado');
      loadChallenges();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
          Panel de Administración
        </h2>
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>
          {editingId ? 'Editar Reto' : 'Crear Nuevo Reto'}
        </h3>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600' }}>Título</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600' }}>Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600' }}>Duración (días)</label>
              <input type="number" min="1" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600' }}>Dificultad</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} style={inputStyle}>
                <option value="facil">Fácil</option>
                <option value="intermedio">Intermedio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600' }}>Imagen URL (opcional)</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}>
              {editingId ? 'Actualizar' : 'Crear Reto'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} style={{
                background: 'rgba(100,116,139,0.1)',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Retos Existentes ({challenges.length})</h3>
        </div>
        {challenges.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No hay retos creados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Título</th>
                  <th style={thStyle}>Días</th>
                  <th style={thStyle}>Dificultad</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>{c.id}</td>
                    <td style={{ ...tdStyle, fontWeight: '500' }}>{c.title}</td>
                    <td style={tdStyle}>{c.duration_days}</td>
                    <td style={tdStyle}>{c.difficulty}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button onClick={() => handleEdit(c)} style={{
                        background: 'rgba(245,158,11,0.1)',
                        color: '#d97706',
                        border: '1px solid rgba(245,158,11,0.2)',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginRight: '0.35rem',
                        transition: 'all 0.2s ease',
                      }}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{
                        background: 'rgba(239,68,68,0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.2)',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const thStyle = {
  padding: '0.75rem 1.5rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  color: '#94a3b8',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #f1f5f9',
};

const tdStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '0.9rem',
  color: '#475569',
};

export default AdminPanel;
