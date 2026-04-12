import { useState, useEffect } from 'react';
import api from '../services/api.service';
import { Job, JobType, JobStatus } from '../types/job.types';
import toast from 'react-hot-toast';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async (formData: { 
    title: string; 
    company: string; 
    location: string; 
    stipend: string; 
    openings: number; 
    applyBy: string; 
    type: JobType; 
    status: JobStatus; 
    logo?: string 
  }) => {
    try {
      const res = await api.post('/jobs', formData);
      setJobs([res.data.job, ...jobs]);
      toast.success('Job listed successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to save job:', error);
      const msg = error.response?.data?.message || 'Failed to save job listing.';
      toast.error(msg);
      return false;
    }

  };

  const editJob = async (
    id: string, 
    formData: { 
      title: string; 
      company: string; 
      location: string; 
      stipend: string; 
      openings: number; 
      applyBy: string; 
      type: JobType; 
      status: JobStatus; 
      logo?: string 
    }
  ) => {
    try {
      const res = await api.put(`/jobs/${id}`, formData);
      setJobs(jobs.map(j => j._id === res.data.job._id ? res.data.job : j));
      toast.success('Job updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to save job:', error);
      const msg = error.response?.data?.message || 'Failed to update job listing.';
      toast.error(msg);
      return false;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Listing removed successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast.error('Failed to delete job listing.');
      return false;
    }
  };

  return { jobs, loading, addJob, editJob, deleteJob, refetch: fetchJobs };
};
