import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Announcements from './pages/Announcements';
import Articles from './pages/Articles';
import JobPortal from './pages/JobPortal';
import CodePlayground from './pages/CodePlayground';
import { ROUTES } from './constants/routes.constants';
import { useAuth } from './context/AuthContext';

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  if (token) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <>{children}</>;
};

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path={ROUTES.LOGIN} element={<AuthRoute><Login /></AuthRoute>} />
          <Route 
            path={ROUTES.DASHBOARD} 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path={ROUTES.LEADERBOARD} 
            element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} 
          />
          <Route 
            path={ROUTES.ANNOUNCEMENTS} 
            element={<ProtectedRoute><Announcements /></ProtectedRoute>} 
          />
          <Route 
            path={ROUTES.ARTICLES} 
            element={<ProtectedRoute><Articles /></ProtectedRoute>} 
          />
          <Route 
            path={ROUTES.JOB_PORTAL} 
            element={<ProtectedRoute><JobPortal /></ProtectedRoute>} 
          />
          <Route 
            path={ROUTES.CODE_PLAYGROUND} 
            element={<ProtectedRoute><CodePlayground /></ProtectedRoute>} 
          />
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </AuthProvider>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '10px' } }} />
    </Router>
  );
}

export default App;