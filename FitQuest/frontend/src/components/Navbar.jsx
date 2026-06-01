import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const linkStyle = (active) => ({
  color: active ? '#fff' : 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: active ? '600' : '400',
  padding: '0.4rem 0.8rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
});

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '1.15rem',
          letterSpacing: '-0.02em',
        }}>
          <span style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: '800',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}>F</span>
          FitQuest
        </Link>
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <Link to="/challenges" style={linkStyle(location.pathname === '/challenges')}>
            Retos
          </Link>
          {user && (
            <>
              <Link to="/my-challenges" style={linkStyle(location.pathname === '/my-challenges')}>
                Mis Retos
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={linkStyle(location.pathname === '/admin')}>
                  Admin
                </Link>
              )}
            </>
          )}
          {user ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </span>
                {user.username}
              </span>
              <button onClick={handleLogout} style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.2)',
                padding: '0.35rem 0.9rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(239,68,68,0.25)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(239,68,68,0.15)'; }}
              >
                Salir
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <Link to="/login" style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                transition: 'color 0.2s ease',
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '0.4rem 1.2rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}>
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
