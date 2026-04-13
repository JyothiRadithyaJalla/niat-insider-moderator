import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  FileText, Search, Plus, Edit3, Trash2, 
  X, Check, Eye, AlertTriangle
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { Article, ArticleStatus } from '../types/article.types';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';

const CATEGORIES = ['Guide', 'News', 'Tech', 'Sports', 'Announcement', 'Event'];
const STATUS_COLORS: Record<string, string> = {
  [ArticleStatus.PUBLISHED]: '#10b981',
  [ArticleStatus.DRAFT]: '#f59e0b',
  [ArticleStatus.ARCHIVED]: '#64748b'
};

const Articles = () => {
  const { articles, loading, addArticle, editArticle, deleteArticle } = useArticles();
  
  /* State */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  /* Form state */
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'Guide',
    status: ArticleStatus.DRAFT
  });

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedArticle(null);
    setFormData({ title: '', body: '', category: 'Guide', status: ArticleStatus.DRAFT });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Article) => {
    setSelectedArticle(a);
    setFormData({ title: a.title, body: a.body, category: a.category, status: a.status });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = selectedArticle 
      ? await editArticle(selectedArticle._id, formData)
      : await addArticle(formData);
    
    if (success) setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (selectedArticle && await deleteArticle(selectedArticle._id)) {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main">
        <header className="niat-header">
          <div>
            <h1 className="niat-page-title">Articles Management</h1>
            <p className="niat-page-subtitle">Create and moderate campus library content</p>
          </div>
          <button onClick={handleOpenAdd} className="niat-btn-add">
            <Plus size={18} />
            <span>New Article</span>
          </button>
        </header>

        <div className="niat-controls">
          <div className="niat-search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="niat-count-badge">
            <FileText size={16} />
            <span>{articles.length} Total Articles</span>
          </div>
        </div>

        <div className="niat-article-list">
          {loading ? (
            <div className="niat-loading-state">
              <div className="niat-spinner"></div>
              <p>Fetching articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="niat-empty-state">
              <FileText size={48} />
              <h3>No articles found</h3>
              <p>Start by creating your first campus article.</p>
            </div>
          ) : (
            filteredArticles.map(a => (
              <div key={a._id} className="niat-article-row">
                <div className="niat-article-info" onClick={() => { setSelectedArticle(a); setIsViewModalOpen(true); }} style={{ cursor: 'pointer' }}>
                  <div className="niat-article-icon-box">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="niat-article-title">{a.title}</h3>
                    <div className="niat-article-tags">
                      <span className="niat-tag" style={{ border: '1px solid currentColor' }}>{a.category}</span>
                      <span className="niat-status-pill" style={{ backgroundColor: `${STATUS_COLORS[a.status]}15`, color: STATUS_COLORS[a.status] }}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="niat-article-meta">
                  <div className="niat-meta-item">
                    <span>{format(new Date(a.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="niat-row-actions">
                    <button onClick={() => { setSelectedArticle(a); setIsViewModalOpen(true); }} className="niat-action-btn view"><Eye size={14} /></button>
                    <button onClick={() => handleOpenEdit(a)} className="niat-action-btn edit"><Edit3 size={14} /></button>
                    <button onClick={() => { setSelectedArticle(a); setIsDeleteModalOpen(true); }} className="niat-action-btn delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="niat-modal niat-modal--sm">
              <div className="niat-delete-icon"><AlertTriangle size={24} /></div>
              <h2 className="niat-delete-title">Delete Article?</h2>
              <p className="niat-delete-desc">Are you sure you want to remove <strong>"{selectedArticle?.title}"</strong>? This is permanent.</p>
              <div className="niat-delete-actions">
                <button onClick={() => setIsDeleteModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button onClick={confirmDelete} className="niat-btn-delete">
                  <Trash2 size={15} />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedArticle && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsViewModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal">
              <div className="niat-modal-header">
                <h2>Article Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="niat-modal-close"><X size={18} /></button>
              </div>
              <div className="niat-modal-body">
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{selectedArticle.title}</h1>
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  <span className="niat-tag">{selectedArticle.category}</span>
                  <span className="niat-tag" style={{ color: STATUS_COLORS[selectedArticle.status] }}>{selectedArticle.status}</span>
                </div>
                <div style={{ lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {selectedArticle.body}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal">
              <div className="niat-modal-header">
                <h2>{selectedArticle ? 'Edit Article' : 'New Article'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="niat-modal-close"><X size={18} /></button>
              </div>
              <form id="article-form" onSubmit={handleSave} className="niat-modal-body">
                <div className="niat-form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Enter article title" />
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group">
                    <label>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="niat-form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ArticleStatus})}>
                      {Object.values(ArticleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="niat-form-group">
                  <label>Body Content</label>
                  <textarea value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} required placeholder="Write the article content..." rows={8}></textarea>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="article-form" className="niat-btn-add">
                  <Check size={16} />
                  <span>{selectedArticle ? 'Update Article' : 'Save Article'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Articles;
