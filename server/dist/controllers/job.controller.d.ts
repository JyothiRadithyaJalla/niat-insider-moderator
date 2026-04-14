import { Request, Response } from 'express';
/**
 * GET /api/jobs
 */
export declare const getJobs: (req: Request, res: Response) => Promise<void>;
/**
 * GET /api/jobs/:id
 */
export declare const getJob: (req: Request, res: Response) => Promise<void>;
/**
 * POST /api/jobs
 */
export declare const addJob: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /api/jobs/:id
 */
export declare const editJob: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /api/jobs/:id
 */
export declare const removeJob: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=job.controller.d.ts.map