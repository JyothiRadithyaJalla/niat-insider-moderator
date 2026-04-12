import { Request, Response, NextFunction } from 'express';
import { ITokenPayload } from '../types/auth.types.js';
declare global {
    namespace Express {
        interface Request {
            user?: ITokenPayload;
        }
    }
}
/**
 * JWT authentication middleware.
 * Extracts & verifies the Bearer token from the Authorization header.
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authenticate.d.ts.map