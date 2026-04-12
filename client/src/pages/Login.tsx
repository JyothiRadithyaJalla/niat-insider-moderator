import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.service';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { ROUTES } from '../constants/routes.constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to login');
      } else {
        setError('Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="bg-glow" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="bg-glow" style={{ bottom: '-20%', right: '-10%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(15, 17, 26, 0) 70%)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6"
      >
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border">
          {/* Subtle gradient line on top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
          
          <div className="text-center mb-8 pt-2">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30"
            >
              <Lock className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Moderator Portal</h1>
            <p className="text-secondary text-sm">Sign in to manage your campus content</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="input-group relative group">
              <label className="label">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="mod@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group relative group">
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Sign In Access</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        <p className="text-center text-sm text-secondary mt-6">
          Protected by strict campus-level RBAC filtering.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
