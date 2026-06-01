import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#f1f5f9',
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.4rem',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.8rem',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/challenges');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171',
            padding: '0.6rem 0.9rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Tu nombre"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading} style={{
          width: '100%',
          padding: '0.75rem',
          background: loading ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.95rem',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(16,185,129,0.3)',
        }}>
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
        <p style={{
          textAlign: 'center',
          marginTop: '1.25rem',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.35)',
        }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{
            color: '#818cf8',
            fontWeight: '600',
            transition: 'color 0.2s',
          }}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
