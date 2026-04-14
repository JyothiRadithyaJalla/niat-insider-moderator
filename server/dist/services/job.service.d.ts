import { IJobDocument } from '../models/Job.model.js';
import { JobType, JobStatus } from '../types/job.types.js';
/**
 * Fetch all jobs for a specific campus.
 */
export declare const getJobsByCampus: (campus: string) => Promise<IJobDocument[]>;
/**
 * Fetch a single job by its ID and campus scoping.
 */
export declare const getJobById: (id: string, campus: string) => Promise<IJobDocument | null>;
/**
 * Create a new job listing for a campus.
 */
export declare const createJob: (data: {
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
}) => Promise<IJobDocument>;
/**
 * Update an existing job profile.
 */
export declare const updateJob: (id: string, campus: string, data: Partial<{
    title: string | undefined;
    company: string | undefined;
    location: string | undefined;
    stipend: string | undefined;
    openings: number | undefined;
    applyBy: Date | undefined;
    type: JobType | undefined;
    status: JobStatus | undefined;
    logo: string | undefined;
}>) => Promise<IJobDocument | null>;
/**
 * Remove a job listing from the board.
 */
export declare const deleteJob: (id: string, campus: string) => Promise<IJobDocument | null>;
//# sourceMappingURL=job.service.d.ts.map