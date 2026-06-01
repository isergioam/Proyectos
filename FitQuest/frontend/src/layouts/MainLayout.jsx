import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
