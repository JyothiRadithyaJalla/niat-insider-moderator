import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Article, ArticleStatus } from '../types/article.types';

interface EditArticleModalProps {
  selectedArticle: Article | null;
  formData: { title: string; body: string; category: string; status: ArticleStatus };
  setFormData: (data: { title: string; body: string; category: string; status: ArticleStatus }) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ selectedArticle, formData, setFormData, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel w-full max-w-2xl rounded-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b flex items-center justify-between border-gray-800">
          <h2 className="text-xl font-semibold">{selectedArticle ? 'Edit Article' : 'New Article'}</h2>
          <button onClick={onClose} className="text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="edit-form" onSubmit={onSave} className="flex flex-col gap-5">
            <div className="input-group">
              <label className="label">Article Title</label>
              <input 
                type="text" className="input text-lg" placeholder="Campus Event Title"
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="input-group">
                <label className="label">Category</label>
                <input 
                  type="text" className="input" placeholder="e.g. Announcements, Events"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required
                />
              </div>
              <div className="input-group">
                <label className="label">Status</label>
                <select 
                  className="input" 
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as ArticleStatus})}
                >
                  <option value={ArticleStatus.DRAFT}>Draft</option>
                  <option value={ArticleStatus.PUBLISHED}>Published</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="label">Content Body</label>
              <textarea 
                className="input min-h-[200px]" placeholder="Write your article content here..."
                value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} required
              ></textarea>
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" form="edit-form" className="btn btn-primary flex items-center gap-2">
            <Check size={16} /> <span>Save Changes</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditArticleModal;
