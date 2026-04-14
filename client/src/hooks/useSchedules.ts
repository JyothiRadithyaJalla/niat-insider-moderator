import { useState, useEffect } from 'react';
import api from '../services/api.service';
import toast from 'react-hot-toast';

export type ScheduleType = 'lecture' | 'practice' | 'lab' | 'seminar';

export interface ScheduleItem {
  _id: string;
  type: ScheduleType;
  title: string;
  time: string;
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const addSchedule = async (data: Omit<ScheduleItem, '_id'>) => {
    try {
      const res = await api.post('/schedules', data);
      setSchedules([...schedules, res.data]);
      toast.success('Schedule added!');
      return true;
    } catch (error) {
      toast.error('Failed to add schedule');
      return false;
    }
  };

  const editSchedule = async (id: string, data: Omit<ScheduleItem, '_id'>) => {
    try {
      const res = await api.put(`/schedules/${id}`, data);
      setSchedules(schedules.map(s => s._id === id ? res.data : s));
      toast.success('Schedule updated!');
      return true;
    } catch (error) {
      toast.error('Failed to update schedule');
      return false;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(schedules.filter(s => s._id !== id));
      toast.success('Schedule deleted!');
      return true;
    } catch (error) {
      toast.error('Failed to delete schedule');
      return false;
    }
  };

  return { schedules, loading, addSchedule, editSchedule, deleteSchedule };
};
