import { Request, Response } from 'express';
import '../middleware/authenticate.js';
/**
 * POST /api/auth/signup
 * Registers a new user and returns JWT token.
 */
export declare const signup: (req: Request, res: Response) => Promise<void>;
/**
 * POST /api/auth/login
 * Authenticates user with email & password, returns JWT token.
 */
export declare const login: (req: Request, res: Response) => Promise<void>;
/**
 * GET /api/auth/me
 * Returns the authenticated user's profile.
 */
export declare const getMe: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map