import { useState, useEffect } from 'react';
import api from '../services/api.service';
import toast from 'react-hot-toast';

export interface TrackItem {
  _id: string;
  title: string;
  learningStatus: string;
  learningProgress: number;
  practiceStatus: string;
  practiceProgress: number;
  gradient: string;
}

export const useTracks = () => {
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await api.get('dashboard/tracks');
      setTracks(response.data);
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
      toast.error('Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const addTrack = async (data: Omit<TrackItem, '_id'>) => {
    try {
      const res = await api.post('dashboard/tracks', data);
      setTracks([...tracks, res.data]);
      toast.success('Track added!');
      return true;
    } catch (error) {
      toast.error('Failed to add track');
      return false;
    }
  };

  const editTrack = async (id: string, data: Omit<TrackItem, '_id'>) => {
    try {
      const res = await api.put(`dashboard/tracks/${id}`, data);
      setTracks(tracks.map(t => t._id === id ? res.data : t));
      toast.success('Track updated!');
      return true;
    } catch (error) {
      toast.error('Failed to update track');
      return false;
    }
  };

  const deleteTrack = async (id: string) => {
    try {
      await api.delete(`dashboard/tracks/${id}`);
      setTracks(tracks.filter(t => t._id !== id));
      toast.success('Track deleted!');
      return true;
    } catch (error) {
      toast.error('Failed to delete track');
      return false;
    }
  };

  return { tracks, loading, addTrack, editTrack, deleteTrack };
};
