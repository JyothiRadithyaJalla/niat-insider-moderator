import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/auth.types.js';
/**
 * Role-based authorisation middleware.
 * Restricts access to users whose role is in the allowed list.
 */
export declare const authorise: (...allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Campus scope guard middleware.
 * Ensures a moderator can only access resources from their own campus.
 * Specifically checks `article.campus === req.user.campus` for mutations.
 */
export declare const campusScopeGuard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authorise.d.ts.map