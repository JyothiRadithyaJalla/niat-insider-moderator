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

  const addAnnouncement = async (announcement: any) => {
    try {
      const response = await api.post('/announcements', announcement);
      setAnnouncements([response.data, ...announcements]);
      toast.success('Announcement posted!');
      return true;
    } catch (err) {
      toast.error('Failed to post');
      return false;
    }
  };

  const updateAnnouncement = async (id: string, updates: any) => {
    try {
      const response = await api.put(`/announcements/${id}`, updates);
      setAnnouncements(announcements.map(a => a._id === id ? response.data : a));
      toast.success('Announcement updated!');
      return true;
    } catch (err) {
      toast.error('Failed to update');
      return false;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a._id !== id));

  return { announcements, loading, addAnnouncement, editAnnouncement, deleteAnnouncement, refetch: fetchAnnouncements };
};
