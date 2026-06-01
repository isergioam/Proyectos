import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/challenges');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesion');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '1rem', color: '#555' }}>Iniciar Sesion</h2>
        {error && (
          <div style={{ color: '#dc3545', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{error}</div>
        )}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>Contrasena</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" style={{
          width: '100%',
          padding: '0.6rem',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}>
          Entrar
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          No tienes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
