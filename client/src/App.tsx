import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Announcements from './pages/Announcements';
import JobPortal from './pages/JobPortal';
import CodePlayground from './pages/CodePlayground';
import { ROUTES } from './constants/routes.constants';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
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
