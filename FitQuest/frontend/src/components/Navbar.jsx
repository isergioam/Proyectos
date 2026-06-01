import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>F</span>
          FitQuest
        </Link>
        <div className={styles.links}>
          <Link to="/challenges" className={isActive('/challenges') ? styles.linkActive : styles.link}>
            Retos
          </Link>
          {user && (
            <>
              <Link to="/my-challenges" className={isActive('/my-challenges') ? styles.linkActive : styles.link}>
                Mis Retos
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin') ? styles.linkActive : styles.link}>
                  Admin
                </Link>
              )}
            </>
          )}
          {user ? (
            <div className={styles.authSection}>
              <span className={styles.username}>
                <span className={styles.avatar}>
                  {user.username.charAt(0).toUpperCase()}
                </span>
                {user.username}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Salir
              </button>
            </div>
          ) : (
            <div className={styles.guestLinks}>
              <Link to="/login" className={styles.authLink}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Registro</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
