import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import styles from './Register.module.css';

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
        {error && <div className={styles.errorBox}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <label className={styles.label}>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Tu nombre"
            className={styles.input}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            className={styles.input}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
            className={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.footerLink}>Inicia sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
