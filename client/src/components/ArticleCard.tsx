import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit3, Trash2 } from 'lucide-react';
import { Article } from '../types/article.types';

interface ArticleCardProps {
  article: Article;
  idx: number;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, idx, onEdit, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05 }}
      className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-500/30 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`badge ${article.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`}>
            {article.status}
          </span>
          <span className="badge badge-category">{article.category}</span>
          <span className="text-xs text-secondary ml-auto md:ml-0 flex items-center gap-1">
            <MapPin size={12} /> {article.campus}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-secondary text-sm line-clamp-2 leading-relaxed">
          {article.body}
        </p>
      </div>
      
      <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(article)}
          className="btn btn-secondary p-2 flex-1 md:flex-none"
          title="Edit Article"
        >
          <Edit3 size={18} />
        </button>
        <button 
          onClick={() => onDelete(article)}
          className="btn btn-danger p-2 flex-1 md:flex-none"
          title="Delete Article"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
