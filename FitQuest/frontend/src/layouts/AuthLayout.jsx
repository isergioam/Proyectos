const AuthLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.5s ease forwards',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          }}>F</div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#f1f5f9',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>FitQuest</h1>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.85rem',
            marginTop: '0.25rem',
          }}>Supera tus límites</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
