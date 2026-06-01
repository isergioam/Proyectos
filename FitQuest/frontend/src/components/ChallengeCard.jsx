import { Link } from 'react-router-dom';

const difficultyColors = {
  facil: '#28a745',
  intermedio: '#ffc107',
  dificil: '#dc3545',
};

const ChallengeCard = ({ challenge }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ margin: '0 0 0.5rem' }}>{challenge.title}</h3>
      <p style={{ color: '#666', margin: '0 0 0.5rem' }}>
        {challenge.description?.substring(0, 100)}...
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{
          background: difficultyColors[challenge.difficulty] || '#6c757d',
          color: '#fff',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
        }}>
          {challenge.difficulty}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>
          {challenge.duration_days} dias
        </span>
      </div>
      <Link to={`/challenges/${challenge.id}`} style={{
        display: 'inline-block',
        background: '#007bff',
        color: '#fff',
        padding: '0.4rem 1rem',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '0.9rem',
      }}>
        Ver Detalle
      </Link>
    </div>
  );
};

export default ChallengeCard;
