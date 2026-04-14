import Job from '../models/Job.model.js';
/**
 * Fetch all jobs for a specific campus.
 */
export const getJobsByCampus = async (campus) => {
    return Job.find({ campus }).sort({ createdAt: -1 });
};
/**
 * Fetch a single job by its ID and campus scoping.
 */
export const getJobById = async (id, campus) => {
    return Job.findOne({ _id: id, campus });
};
/**
 * Create a new job listing for a campus.
 */
export const createJob = async (data) => {
    const job = new Job(data);
    return job.save();
};
/**
 * Update an existing job profile.
 */
export const updateJob = async (id, campus, data) => {
    return Job.findOneAndUpdate({ _id: id, campus }, { $set: data }, { new: true, runValidators: true });
};
/**
 * Remove a job listing from the board.
 */
export const deleteJob = async (id, campus) => {
    return Job.findOneAndDelete({ _id: id, campus });
};
//# sourceMappingURL=job.service.js.map