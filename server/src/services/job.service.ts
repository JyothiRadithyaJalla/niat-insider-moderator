import Job, { IJobDocument } from '../models/Job.model.js';
import { JobType, JobStatus } from '../types/job.types.js';

/**
 * Fetch all jobs for a specific campus.
 */
export const getJobsByCampus = async (campus: string): Promise<IJobDocument[]> => {
  return Job.find({ campus }).sort({ createdAt: -1 });
};

/**
 * Fetch a single job by its ID and campus scoping.
 */
export const getJobById = async (id: string, campus: string): Promise<IJobDocument | null> => {
  return Job.findOne({ _id: id, campus });
};

/**
 * Create a new job listing for a campus.
 */
export const createJob = async (data: {
  title: string;
  company: string;
  location: string;
  stipend: string;
  openings: number;
  applyBy: Date;
  type: JobType;
  status: JobStatus;
  campus: string;
  authorId: string;
  logo?: string | undefined;
}): Promise<IJobDocument> => {
  const job = new Job(data);
  return job.save();
};

/**
 * Update an existing job profile.
 */
export const updateJob = async (
  id: string,
  campus: string,
  data: Partial<{
    title: string | undefined;
    company: string | undefined;
    location: string | undefined;
    stipend: string | undefined;
    openings: number | undefined;
    applyBy: Date | undefined;
    type: JobType | undefined;
    status: JobStatus | undefined;
    logo: string | undefined;
  }>
): Promise<IJobDocument | null> => {
  return Job.findOneAndUpdate(
    { _id: id, campus },
    { $set: data },
    { new: true, runValidators: true }
  );
};

/**
 * Remove a job listing from the board.
 */
export const deleteJob = async (id: string, campus: string): Promise<IJobDocument | null> => {
  return Job.findOneAndDelete({ _id: id, campus });
};
