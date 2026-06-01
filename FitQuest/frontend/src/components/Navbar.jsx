import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#333',
      color: '#fff',
      padding: '0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
        FitQuest
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/challenges" style={{ color: '#fff', textDecoration: 'none' }}>Retos</Link>
        {user && (
          <>
            <Link to="/my-challenges" style={{ color: '#fff', textDecoration: 'none' }}>Mis Retos</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
            )}
          </>
        )}
        {user ? (
          <>
            <span style={{ color: '#ccc' }}>{user.username}</span>
            <button onClick={handleLogout} style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
