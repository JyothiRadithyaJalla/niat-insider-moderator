import { useState, useEffect } from 'react';
import api from '../services/api.service';
import toast from 'react-hot-toast';

export interface Snippet {
  _id: string;
  title: string; // The Name (e.g. C++)
  code: string;
  language: string; // The Runner Type (e.g. javascript)
  color: string;
  campus: string;
  createdAt: string;
}

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = async () => {
    try {
      const response = await api.get('snippets');
      setSnippets(response.data);
    } catch (err) {
      console.error('Failed to fetch snippets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const addSnippet = async (snippet: Omit<Snippet, '_id' | 'campus' | 'createdAt'>) => {
    try {
      const response = await api.post('snippets', snippet);
      setSnippets([...snippets, response.data]);
      toast.success('Language environment created!');
      return response.data;
    } catch (err) {
      toast.error('Failed to create language environment');
      return null;
    }
  };

  const updateSnippet = async (id: string, updates: Partial<Snippet>) => {
    try {
      const response = await api.put(`snippets/${id}`, updates);
      setSnippets(snippets.map(s => s._id === id ? response.data : s));
      toast.success('Settings updated!');
      return response.data;
    } catch (err) {
      toast.error('Failed to update settings');
      return null;
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      await api.delete(`snippets/${id}`);
      setSnippets(snippets.filter(s => s._id !== id));
      toast.success('Snippet deleted');
      return true;
    } catch (err) {
      toast.error('Failed to delete snippet');
      return false;
    }
  };

  return { snippets, loading, addSnippet, updateSnippet, deleteSnippet };
};
