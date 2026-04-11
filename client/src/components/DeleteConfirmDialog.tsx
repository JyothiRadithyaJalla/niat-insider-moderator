import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Article } from '../types/article.types';
import { useAuth } from '../context/AuthContext';

interface DeleteConfirmDialogProps {
  selectedArticle: Article | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ selectedArticle, onClose, onConfirm }) => {
  const { user } = useAuth();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-panel w-full max-w-md p-6 rounded-2xl relative z-10 border border-red-500/20 shadow-2xl shadow-red-500/10"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4 border border-red-500/30">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-xl font-bold mb-2">Delete permanently?</h2>
        <p className="text-secondary text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{selectedArticle?.title}"</span>? This action cannot be undone and will permanently remove it from the {user?.campus} campus feed.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger flex items-center gap-2">
            <Trash2 size={16} /> <span>Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmDialog;
