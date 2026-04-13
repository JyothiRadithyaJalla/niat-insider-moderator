import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import { HttpStatus } from '../types/auth.types.js';
/**
 * JWT authentication middleware.
 * Extracts & verifies the Bearer token from the Authorization header.
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access denied. No token provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access denied. Malformed token.' });
        return;
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
    }
};
//# sourceMappingURL=authenticate.js.map