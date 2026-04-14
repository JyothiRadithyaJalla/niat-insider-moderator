import { useState, useEffect } from 'react';
import api from '../services/api.service';
import toast from 'react-hot-toast';

export type EventType = 'Upcoming' | 'Live' | 'Challenge' | 'Podcast';

export interface CampusEvent {
  _id: string;
  title: string;
  type: EventType;
  date: string;
  isLive: boolean;
}

export const useEvents = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (data: Omit<CampusEvent, '_id'>) => {
    try {
      const res = await api.post('/events', data);
      setEvents([...events, res.data]);
      toast.success('Event added!');
      return true;
    } catch (error) {
      toast.error('Failed to add event');
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      toast.success('Event deleted!');
      return true;
    } catch (error) {
      toast.error('Failed to delete event');
      return false;
    }
  };

  return { events, loading, addEvent, deleteEvent };
};
