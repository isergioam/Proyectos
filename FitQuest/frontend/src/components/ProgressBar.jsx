const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div style={{
      width: '100%',
      background: '#e9ecef',
      borderRadius: '4px',
      height: '20px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${percentage}%`,
        background: percentage >= 100 ? '#28a745' : '#007bff',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '0.75rem',
        transition: 'width 0.3s ease',
      }}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export default ProgressBar;
