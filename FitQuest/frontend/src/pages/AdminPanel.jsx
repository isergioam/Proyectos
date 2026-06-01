import { useState, useEffect } from 'react';
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const emptyForm = { title: '', description: '', duration_days: '', difficulty: 'facil', image: '' };

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
        setMessage('Reto actualizado');
      } else {
        await createChallenge(form);
        setMessage('Reto creado');
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
    if (!window.confirm('Seguro de eliminar este reto?')) return;
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
      <h2>Panel de Administracion</h2>

      <form onSubmit={handleSubmit} style={{
        border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem',
      }}>
        <h3>{editingId ? 'Editar Reto' : 'Crear Reto'}</h3>
        {message && <div style={{ color: '#28a745', marginBottom: '0.5rem' }}>{message}</div>}
        {error && <div style={{ color: '#dc3545', marginBottom: '0.5rem' }}>{error}</div>}

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Titulo</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Descripcion</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Duracion (dias)</label>
          <input
            type="number"
            min="1"
            value={form.duration_days}
            onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Dificultad</label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="facil">Facil</option>
            <option value="intermedio">Intermedio</option>
            <option value="dificil">Dificil</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Imagen URL (opcional)</label>
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{
            background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1.5rem',
            borderRadius: '4px', cursor: 'pointer',
          }}>
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{
              background: '#6c757d', color: '#fff', border: 'none', padding: '0.5rem 1.5rem',
              borderRadius: '4px', cursor: 'pointer',
            }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Retos Existentes</h3>
      {challenges.length === 0 ? (
        <p>No hay retos creados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Titulo</th>
              <th style={thStyle}>Dias</th>
              <th style={thStyle}>Dificultad</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c) => (
              <tr key={c.id}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.title}</td>
                <td style={tdStyle}>{c.duration_days}</td>
                <td style={tdStyle}>{c.difficulty}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(c)} style={{
                    background: '#ffc107', color: '#000', border: 'none', padding: '0.3rem 0.75rem',
                    borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem',
                  }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(c.id)} style={{
                    background: '#dc3545', color: '#fff', border: 'none', padding: '0.3rem 0.75rem',
                    borderRadius: '4px', cursor: 'pointer',
                  }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
};

const thStyle = { border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' };
const tdStyle = { border: '1px solid #ddd', padding: '0.5rem' };

export default AdminPanel;
