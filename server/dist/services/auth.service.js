import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { env } from '../config/env.config.js';
import { UserRole } from '../types/auth.types.js';
/**
 * Authenticates a user by email + password and returns a JWT.
 */
export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }
    const tokenPayload = {
        userId: String(user._id),
        role: user.role,
        campus: user.campus,
    };
    const token = jwt.sign(tokenPayload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    return {
        token,
        user: {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
            campus: user.campus,
        },
    };
};
/**
 * Registers a new user and returns a JWT.
 */
export const signupUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists in our system.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = await User.create({
        ...userData,
        password: hashedPassword,
        role: userData.role || UserRole.MODERATOR
    });
    const tokenPayload = {
        userId: String(user._id),
        role: user.role,
        campus: user.campus,
    };
    const token = jwt.sign(tokenPayload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    return {
        token,
        user: {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
            campus: user.campus,
        },
    };
};
/**
 * Retrieves user profile by ID (excludes password).
 */
export const getUserProfile = async (userId) => {
    return User.findById(userId).select('-password');
};
//# sourceMappingURL=auth.service.js.map