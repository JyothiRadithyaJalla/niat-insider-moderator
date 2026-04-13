import { useState, useEffect } from 'react';
import api from '../services/api.service';
import { Article, ArticleStatus } from '../types/article.types';
import toast from 'react-hot-toast';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get('articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const addArticle = async (formData: { title: string; body: string; category: string; status: ArticleStatus }) => {
    try {
      const res = await api.post('articles', formData);
      setArticles([res.data.article, ...articles]);
      toast.success('Article created successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('Failed to save article.');
      return false;
    }
  };

  const editArticle = async (id: string, formData: { title: string; body: string; category: string; status: ArticleStatus }) => {
    try {
      const res = await api.put(`articles/${id}`, formData);
      setArticles(articles.map(a => a._id === res.data.article._id ? res.data.article : a));
      toast.success('Article updated successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('Failed to save article.');
      return false;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await api.delete(`articles/${id}`);
      setArticles(articles.filter(a => a._id !== id));
      toast.success('Article deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('Failed to delete article.');
      return false;
    }
  };

  return { articles, loading, addArticle, editArticle, deleteArticle };
};
