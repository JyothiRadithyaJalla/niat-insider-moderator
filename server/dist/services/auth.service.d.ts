import { IUserDocument } from '../models/User.model.js';
import { UserRole } from '../types/auth.types.js';
interface LoginResult {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        campus: string;
    };
}
/**
 * Authenticates a user by email + password and returns a JWT.
 */
export declare const loginUser: (email: string, password: string) => Promise<LoginResult>;
/**
 * Retrieves user profile by ID (excludes password).
 */
export declare const getUserProfile: (userId: string) => Promise<IUserDocument | null>;
export {};
//# sourceMappingURL=auth.service.d.ts.map