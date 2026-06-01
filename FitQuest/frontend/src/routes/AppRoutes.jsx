import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ChallengeCatalog from '../pages/ChallengeCatalog';
import ChallengeDetail from '../pages/ChallengeDetail';
import MyChallenges from '../pages/MyChallenges';
import RegisterProgress from '../pages/RegisterProgress';
import Ranking from '../pages/Ranking';
import AdminPanel from '../pages/AdminPanel';
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/challenges" />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/challenges" element={<ChallengeCatalog />} />
      <Route path="/challenges/:id" element={<ChallengeDetail />} />
      <Route path="/challenges/:id/ranking" element={<Ranking />} />
      <Route
        path="/my-challenges"
        element={<PrivateRoute><MyChallenges /></PrivateRoute>}
      />
      <Route
        path="/progress/:challengeId"
        element={<PrivateRoute><RegisterProgress /></PrivateRoute>}
      />
      <Route
        path="/admin"
        element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>}
      />
      <Route path="/" element={<Navigate to="/challenges" />} />
      <Route path="*" element={<Navigate to="/challenges" />} />
    </Routes>
  );
};

export default AppRoutes;
