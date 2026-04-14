import { Request, Response } from 'express';
/**
 * GET /api/announcements
 */
export declare const getAnnouncements: (req: Request, res: Response) => Promise<void>;
/**
 * GET /api/announcements/:id
 */
export declare const getAnnouncement: (req: Request, res: Response) => Promise<void>;
/**
 * POST /api/announcements
 */
export declare const addAnnouncement: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /api/announcements/:id
 */
export declare const editAnnouncement: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /api/announcements/:id
 */
export declare const removeAnnouncement: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=announcement.controller.d.ts.map