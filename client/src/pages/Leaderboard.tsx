import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.service';
import { Article } from '../types/article.types';
import { motion } from 'framer-motion';
import { ROUTES } from '../constants/routes.constants';
import { ArrowLeft, LayoutDashboard, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const Leaderboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch articles for leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data using useMemo to avoid recalculating on every render
  const categoryData = useMemo(() => {
    const categoryCount = articles.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(categoryCount)
      .map(key => ({ name: key, value: categoryCount[key] }))
      .sort((a, b) => b.value - a.value);
  }, [articles]);

  const authorData = useMemo(() => {
    // In our simplified model `authorId` is stored. Typically this would be populated with author names.
    // For visual demonstration we will chart by author IDs or treat status breakdown instead if author names are missing.
    // Let's do a Status Breakdown pie chart.
    const statusCount = articles.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(statusCount).map(key => ({ name: key, value: statusCount[key] }));
  }, [articles]);

  return (
    <div className="min-h-screen relative pb-20">
      <div className="bg-glow" style={{ top: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(15, 17, 26, 0) 70%)' }}></div>
      <div className="bg-glow" style={{ bottom: '10%', left: '-20%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, rgba(15, 17, 26, 0) 70%)' }}></div>

      <nav className="glass-panel sticky top-0 z-10 border-x-0 border-t-0 rounded-none px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="text-secondary hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <PieChartIcon size={20} className="text-indigo-400" />
              <span>Analytics Leaderboard</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="btn btn-secondary flex items-center gap-2 text-sm"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campus Analytics</h1>
          <p className="text-secondary">Visual insights and content distribution for {user?.campus}.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl border border-dashed border-gray-700">
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4 text-gray-500">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-xl font-medium mb-1">No data to analyze</h3>
            <p className="text-secondary">Create some articles first to view the leaderboard metrics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="mb-6 border-b border-gray-800 pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart2 size={20} className="text-indigo-400" />
                  Articles by Category
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#adb5bd" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#adb5bd" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#1e2233', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="url(#colorUv)" radius={[4, 4, 0, 0]}>
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Status Breakdown Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="mb-6 border-b border-gray-800 pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <PieChartIcon size={20} className="text-pink-400" />
                  Publication Status
                </h3>
              </div>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={authorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {authorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'PUBLISHED' ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e2233', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
