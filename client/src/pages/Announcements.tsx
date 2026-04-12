import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Megaphone, Bell, Calendar, Pin, Plus, 
  Search, Edit3, Trash2, X, Check, Eye, AlertTriangle 
} from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { Announcement, AnnouncementType } from '../types/announcement.types';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Academic':       { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  'Event':          { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'Infrastructure': { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  'Facility':       { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
};
const DEFAULT_COLOR = { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };

const Announcements = () => {
  const { announcements, loading, addAnnouncement, editAnnouncement, deleteAnnouncement } = useAnnouncements();
  
  /* Modals state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  /* Form state */
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: AnnouncementType.ACADEMIC,
    pinned: false
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedAnnouncement(null);
    setFormData({ title: '', content: '', type: AnnouncementType.ACADEMIC, pinned: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Announcement) => {
    setSelectedAnnouncement(a);
    setFormData({ title: a.title, content: a.content, type: a.type, pinned: a.pinned });
    setIsModalOpen(true);
  };

  const handleOpenView = (a: Announcement) => {
    setSelectedAnnouncement(a);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (a: Announcement) => {
    setSelectedAnnouncement(a);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = selectedAnnouncement 
      ? await editAnnouncement(selectedAnnouncement._id, formData)
      : await addAnnouncement(formData);
    
    if (success) setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (selectedAnnouncement && await deleteAnnouncement(selectedAnnouncement._id)) {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main">
        <header className="niat-header">
          <div className="niat-header-left">
            <h1 className="niat-page-title">Announcements</h1>
            <span className="niat-page-subtitle">Manage campus news and updates</span>
          </div>
          <button onClick={handleOpenAdd} className="niat-btn-add">
            <Plus size={18} />
            <span>New Announcement</span>
          </button>
        </header>

        {/* Filters & Info */}
        <div className="niat-controls">
          <div className="niat-search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="niat-count-badge">
            <Bell size={16} />
            <span>{announcements.length} Total Updates</span>
          </div>
        </div>

        <div className="niat-article-list">
          {loading ? (
            <div className="niat-loading-state">
              <div className="niat-spinner"></div>
              <p>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="niat-empty-state">
              <Megaphone size={48} />
              <h3>No announcements found</h3>
              <p>Try adjusting your search or add a new update.</p>
            </div>
          ) : (
            filteredAnnouncements.map(a => {
              const color = TYPE_COLORS[a.type] || DEFAULT_COLOR;
              return (
                <div key={a._id} className="niat-article-row">
                  <div className="niat-article-info" onClick={() => handleOpenView(a)} style={{ cursor: 'pointer' }}>
                    <Megaphone size={16} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 4 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="niat-article-title">{a.title}</span>
                      <p className="niat-row-snippet">{a.content.substring(0, 100)}{a.content.length > 100 ? '...' : ''}</p>
                      <div className="niat-article-tags">
                        <span className="niat-tag" style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                          {a.type}
                        </span>
                        {a.pinned && (
                          <span className="niat-pinned-tag">
                            <Pin size={11} /> Pinned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="niat-article-meta">
                    <div className="niat-meta-item">
                      <Calendar size={12} />
                      <span>{format(new Date(a.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="niat-row-actions">
                      <button onClick={() => handleOpenView(a)} className="niat-action-btn view" title="View"><Eye size={14} /></button>
                      <button onClick={() => handleOpenEdit(a)} className="niat-action-btn edit" title="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => handleOpenDelete(a)} className="niat-action-btn delete" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ═══════ MODALS ═══════ */}

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedAnnouncement && (
          <div className="niat-modal-overlay">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="niat-modal-backdrop" onClick={() => setIsViewModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="niat-modal"
            >
              <div className="niat-modal-header">
                <h2>View Announcement</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="niat-modal-close"><X size={18} /></button>
              </div>
              <div className="niat-modal-body">
                <div className="niat-view-field">
                  <label>Title</label>
                  <p className="niat-view-title">{selectedAnnouncement.title}</p>
                </div>
                <div className="niat-view-row">
                  <div className="niat-view-field">
                    <label>Category</label>
                    <span className="niat-tag" style={{ 
                      backgroundColor: TYPE_COLORS[selectedAnnouncement.type]?.bg, 
                      color: TYPE_COLORS[selectedAnnouncement.type]?.text 
                    }}>
                      {selectedAnnouncement.type}
                    </span>
                  </div>
                  <div className="niat-view-field">
                    <label>Date</label>
                    <p>{format(new Date(selectedAnnouncement.createdAt), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="niat-view-field">
                  <label>Content</label>
                  <div className="niat-view-content">{selectedAnnouncement.content}</div>
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
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="niat-modal-backdrop" onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="niat-modal"
            >
              <div className="niat-modal-header">
                <h2>{selectedAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="niat-modal-close"><X size={18} /></button>
              </div>
              <form id="announcement-form" onSubmit={handleSave} className="niat-modal-body">
                <div className="niat-form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    placeholder="E.g., Mid-Semester Schedule Released"
                  />
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group">
                    <label>Category</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value as AnnouncementType})}
                    >
                      {Object.values(AnnouncementType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="niat-form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
                    <input 
                      type="checkbox" 
                      id="pinned" 
                      checked={formData.pinned} 
                      onChange={e => setFormData({...formData, pinned: e.target.checked})}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <label htmlFor="pinned" style={{ marginBottom: 0, cursor: 'pointer' }}>Pin to top</label>
                  </div>
                </div>
                <div className="niat-form-group">
                  <label>Content</label>
                  <textarea 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    required 
                    placeholder="Write the full announcement details..."
                    rows={6}
                  ></textarea>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="announcement-form" className="niat-btn-add">
                  <Check size={16} />
                  <span>{selectedAnnouncement ? 'Update' : 'Post Announcement'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="niat-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="niat-modal niat-modal--sm"
            >
              <div className="niat-delete-icon">
                <AlertTriangle size={24} />
              </div>
              <h2 className="niat-delete-title">Remove Announcement?</h2>
              <p className="niat-delete-desc">
                Are you sure you want to delete <strong>"{selectedAnnouncement?.title}"</strong>? 
                This action cannot be undone.
              </p>
              <div className="niat-delete-actions">
                <button onClick={() => setIsDeleteModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button onClick={confirmDelete} className="niat-btn-delete">
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;

