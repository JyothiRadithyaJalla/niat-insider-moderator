import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Cpu, Globe } from 'lucide-react';
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
        setError(error.response?.data?.message || 'Invalid credentials. Please check and try again.');
      } else {
        setError('Connection error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="login-card-wrapper"
      >
        <div className="login-card">
          <div className="login-card-inner">
            {/* Header / Logo Section */}
            <div className="login-header">
              <motion.div 
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="login-logo-orb"
              >
                <ShieldCheck size={32} className="logo-icon" />
              </motion.div>
              <h1 className="login-title">NIAT Moderator</h1>
              <p className="login-subtitle">Secure access to campus management system</p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="login-error"
                >
                  <span className="error-text">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-group">
                <label>Institutional Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    placeholder="moderator@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label>Access Key</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    placeholder="Enter your security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`login-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <span>Authorize Login</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Security Footer */}
            <div className="login-security-footer">
              <div className="security-item">
                <Cpu size={14} />
                <span>AES-256 Encrypted</span>
              </div>
              <div className="security-item">
                <Globe size={14} />
                <span>Global RBAC Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <p className="login-footer-text">
          &copy; 2024 NIAT Insider Platform. Unauthorized access is strictly prohibited.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
