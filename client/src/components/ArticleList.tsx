import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ArticleCard from './ArticleCard';
import { Article } from '../types/article.types';

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <AnimatePresence>
        {articles.map((article, idx) => (
          <ArticleCard 
            key={article._id} 
            article={article} 
            idx={idx} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ArticleList;
