import { useState, useEffect } from 'react';
import { getChallenges } from '../api/challenges';
import ChallengeCard from '../components/ChallengeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

const ChallengeCatalog = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getChallenges()
      .then((res) => setChallenges(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar retos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;

  return (
    <MainLayout>
      <h2>Catalogo de Retos</h2>
      {error && <div style={{ color: '#dc3545' }}>{error}</div>}
      {challenges.length === 0 ? (
        <p>No hay retos disponibles.</p>
      ) : (
        challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))
      )}
    </MainLayout>
  );
};

export default ChallengeCatalog;
