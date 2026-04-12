import { useState, useEffect } from 'react';
import api from '../services/api.service';
import { Announcement, AnnouncementType } from '../types/announcement.types';
import toast from 'react-hot-toast';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async (formData: { 
    title: string; 
    content: string; 
    type: AnnouncementType; 
    pinned?: boolean 
  }) => {
    try {
      const res = await api.post('/announcements', formData);
      setAnnouncements([res.data.announcement, ...announcements]);
      toast.success('Announcement created successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save announcement:', error);
      toast.error('Failed to save announcement.');
      return false;
    }
  };

  const editAnnouncement = async (
    id: string, 
    formData: { 
      title: string; 
      content: string; 
      type: AnnouncementType; 
      pinned?: boolean 
    }
  ) => {
    try {
      const res = await api.put(`/announcements/${id}`, formData);
      setAnnouncements(announcements.map(a => a._id === res.data.announcement._id ? res.data.announcement : a));
      toast.success('Announcement updated successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save announcement:', error);
      toast.error('Failed to save announcement.');
      return false;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a._id !== id));
      toast.success('Announcement deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      toast.error('Failed to delete announcement.');
      return false;
    }
  };

  return { announcements, loading, addAnnouncement, editAnnouncement, deleteAnnouncement, refetch: fetchAnnouncements };
};
