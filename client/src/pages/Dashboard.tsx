import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Article, ArticleStatus } from '../types/article.types';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LogOut, MapPin, Search, Plus, BarChart2 } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import ArticleList from '../components/ArticleList';
import EditArticleModal from '../components/EditArticleModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { ROUTES } from '../constants/routes.constants';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { articles, loading, addArticle, editArticle, deleteArticle } = useArticles();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Form State
  const [formData, setFormData] = useState({ title: '', body: '', category: '', status: ArticleStatus.DRAFT });
  
  const handleEditClick = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      body: article.body,
      category: article.category,
      status: article.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (selectedArticle) {
      success = await editArticle(selectedArticle._id, formData);
    } else {
      success = await addArticle(formData);
    }
    if (success) setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    const success = await deleteArticle(selectedArticle._id);
    if (success) setIsDeleteModalOpen(false);
  };

  const openNewArticleModal = () => {
    setSelectedArticle(null);
    setFormData({ title: '', body: '', category: '', status: ArticleStatus.DRAFT });
    setIsModalOpen(true);
  };

  const categories = ['All', ...new Set(articles.map(a => a.category))];
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative pb-20">
      <div className="bg-glow" style={{ top: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(15, 17, 26, 0) 70%)' }}></div>
      <div className="bg-glow" style={{ bottom: '10%', left: '-20%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(15, 17, 26, 0) 70%)' }}></div>

      <nav className="glass-panel sticky top-0 z-10 border-x-0 border-t-0 rounded-none px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold">{user?.name}</h2>
              <div className="flex items-center gap-1 text-xs text-secondary mt-0.5">
                <MapPin size={12} />
                <span>{user?.campus} Campus</span>
                <span className="mx-2">•</span>
                <span className="badge badge-category">{user?.role}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative z-20">
            <button onClick={() => navigate(ROUTES.LEADERBOARD)} className="btn bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 flex items-center gap-2 text-sm">
              <BarChart2 size={16} /><span>Leaderboard</span>
            </button>
            <button onClick={logout} className="btn btn-secondary flex items-center gap-2 text-sm">
              <LogOut size={16} /><span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campus Articles</h1>
            <p className="text-secondary">Manage and moderate content specifically designated for {user?.campus}.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <Search size={16} />
              </div>
              <input 
                type="text" placeholder="Search articles..." className="input pl-10 py-2 min-w-[200px]"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="input py-2" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={openNewArticleModal} className="btn btn-primary flex items-center gap-2">
              <Plus size={16} /><span>New Article</span>
            </button>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
           </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl border border-dashed border-gray-700">
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4 text-gray-500">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-medium mb-1">No matches found</h3>
            <p className="text-secondary mb-6">No articles matched your search or filters.</p>
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }} className="btn btn-secondary">Clear Filters</button>
          </div>
        ) : (
          <ArticleList articles={filteredArticles} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <EditArticleModal 
            selectedArticle={selectedArticle}
            formData={formData}
            setFormData={setFormData}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteConfirmDialog 
            selectedArticle={selectedArticle}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
