import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <main style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        animation: 'fadeIn 0.4s ease forwards',
      }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
