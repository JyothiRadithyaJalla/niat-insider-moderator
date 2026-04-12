import { Request, Response } from 'express';
/**
 * GET /api/articles
 * Fetches articles scoped to the moderator's campus with pagination.
 */
export declare const getArticles: (req: Request, res: Response) => Promise<void>;
/**
 * GET /api/articles/:id
 * Fetches a single article by ID, scoped to the moderator's campus.
 */
export declare const getArticle: (req: Request, res: Response) => Promise<void>;
/**
 * POST /api/articles
 * Creates a new article under the moderator's campus.
 */
export declare const addArticle: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /api/articles/:id
 * Updates an article (campus-scoped).
 */
export declare const editArticle: (req: Request, res: Response) => Promise<void>;
/**
 * DELETE /api/articles/:id
 * Deletes an article (campus-scoped).
 */
export declare const removeArticle: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=article.controller.d.ts.map