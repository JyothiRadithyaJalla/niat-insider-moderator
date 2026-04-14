import { getJobsByCampus, getJobById, createJob, updateJob, deleteJob, } from '../services/job.service.js';
import { HttpStatus } from '../types/auth.types.js';
/**
 * GET /api/jobs
 */
export const getJobs = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const jobs = await getJobsByCampus(req.user.campus);
        res.status(HttpStatus.OK).json({ jobs });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch jobs.';
        res.status(500).json({ message });
    }
};
/**
 * GET /api/jobs/:id
 */
export const getJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const job = await getJobById(req.params['id'], req.user.campus);
        if (!job) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Job not found.' });
            return;
        }
        res.status(HttpStatus.OK).json({ job });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch job.';
        res.status(500).json({ message });
    }
};
/**
 * POST /api/jobs
 */
export const addJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const { title, company, location, stipend, openings, applyBy, type, status, logo } = req.body;
        const errors = [];
        if (!title)
            errors.push('Job title is required.');
        if (!company)
            errors.push('Company name is required.');
        if (!location)
            errors.push('Job location is required.');
        if (!stipend)
            errors.push('Stipend information is required.');
        if (openings === undefined || openings === null)
            errors.push('Number of openings is required.');
        if (!applyBy)
            errors.push('Application deadline is required.');
        if (errors.length > 0) {
            res.status(400).json({ message: errors.join(' ') });
            return;
        }
        const job = await createJob({
            title,
            company,
            location,
            stipend,
            openings,
            applyBy: new Date(applyBy),
            type,
            status,
            logo,
            campus: req.user.campus,
            authorId: req.user.userId,
        });
        res.status(HttpStatus.CREATED).json({ message: 'Job listed successfully.', job });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create job.';
        res.status(500).json({ message });
    }
};
/**
 * PUT /api/jobs/:id
 */
export const editJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const { title, company, location, stipend, openings, applyBy, type, status, logo } = req.body;
        const job = await updateJob(req.params['id'], req.user.campus, {
            title,
            company,
            location,
            stipend,
            openings,
            applyBy: applyBy ? new Date(applyBy) : undefined,
            type,
            status,
            logo,
        });
        if (!job) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Job not found or not in your campus.' });
            return;
        }
        res.status(HttpStatus.OK).json({ message: 'Job updated.', job });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update job.';
        res.status(500).json({ message });
    }
};
/**
 * DELETE /api/jobs/:id
 */
export const removeJob = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const job = await deleteJob(req.params['id'], req.user.campus);
        if (!job) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Job not found or not in your campus.' });
            return;
        }
        res.status(HttpStatus.OK).json({ message: 'Job deleted successfully.' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete job.';
        res.status(500).json({ message });
    }
};
//# sourceMappingURL=job.controller.js.map