import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.service';
import { motion } from 'framer-motion';
import { Lock, Mail, User, School, ArrowRight, AlertCircle } from 'lucide-react';
import { ROUTES } from '../constants/routes.constants';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password, campus });
      login(response.data.token, response.data.user);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0c10]">
      {/* Background Glow */}
      <div className="bg-glow" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="bg-glow" style={{ bottom: '-20%', right: '-10%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(15, 17, 26, 0) 70%)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6 py-12"
      >
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-purple-500"></div>
          
          <div className="text-center mb-8 pt-2">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30"
            >
              <User className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-secondary text-sm">Join the moderator community</p>
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="input-group relative group">
              <label className="label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label className="label">Campus Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary group-focus-within:text-accent transition-colors">
                  <School size={18} />
                </div>
                <select
                  className="input pl-10 appearance-none bg-[#111827]"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your campus</option>
                  <option value="Sanjay Ghodawat University">Sanjay Ghodawat University</option>
                  <option value="Noida International University">Noida International University</option>
                  <option value="Chaitanya Deemed to be University">Chaitanya Deemed to be University</option>
                  <option value="Nadimpalli Satyanarayana Raju Institute of Technology">NSRIT</option>
                  <option value="Ajeenkya DY Patil University">ADYPU</option>
                  <option value="NRI University">NRI University</option>
                  <option value="Kapil Kavuri Hub">Kapil Kavuri Hub</option>
                  <option value="Yenepoya University">Yenepoya University</option>
                  <option value="Malla Reddy Vishwavidyapeeth">Malla Reddy Vishwavidyapeeth</option>
                  <option value="Vivekananda Global University">Vivekananda Global University</option>
                  <option value="Chalapathi Institute of Engineering and Technology">CIET</option>
                  <option value="AMET University">AMET University</option>
                  <option value="Annamacharya University">Annamacharya University</option>
                  <option value="B. S. Abdur Rahman Crescent Institute of Science & Technology">Crescent Institute</option>
                  <option value="S-VYASA University School of Advanced Studies">S-VYASA University</option>
                </select>
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
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-secondary mt-8">
            Already have an account? {' '}
            <Link to={ROUTES.LOGIN} className="text-accent hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
