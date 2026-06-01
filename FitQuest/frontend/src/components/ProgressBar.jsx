const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div>
      <div style={{
        width: '100%',
        background: '#e2e8f0',
        borderRadius: '10px',
        height: '10px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          width: `${percentage}%`,
          background: percentage >= 100
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : 'linear-gradient(90deg, #6366f1, #818cf8)',
          height: '100%',
          borderRadius: '10px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: percentage >= 100
            ? '0 0 12px rgba(16,185,129,0.4)'
            : '0 0 12px rgba(99,102,241,0.3)',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.35rem',
        fontSize: '0.8rem',
        color: '#64748b',
      }}>
        <span>{Math.round(percentage)}% completado</span>
        <span style={{ fontWeight: '600', color: percentage >= 100 ? '#10b981' : '#6366f1' }}>
          {current} / {total} días
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
