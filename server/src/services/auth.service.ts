import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User.model.js';
import { env } from '../config/env.config.js';
import { ITokenPayload, UserRole } from '../types/auth.types.js';

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
export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  console.log(`[Auth Debug] Attempting login for: ${normalizedEmail}`);
  
  const user: IUserDocument | null = await User.findOne({ email: normalizedEmail });
  if (!user) {
    console.warn(`[Auth Debug] User not found: ${normalizedEmail}`);
    throw new Error('Invalid email or password.');
  }

  const isMatch: boolean = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.warn(`[Auth Debug] Password mismatch for: ${normalizedEmail}`);
    throw new Error('Invalid email or password.');
  }

  const tokenPayload: ITokenPayload = {
    userId: String(user._id),
    role: user.role,
    campus: user.campus,
  };

  const token: string = jwt.sign(
    tokenPayload as unknown as Record<string, unknown>,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as unknown as number }
  );

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
export const signupUser = async (userData: any): Promise<LoginResult> => {
  const normalizedEmail = userData.email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
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

  const tokenPayload: ITokenPayload = {
    userId: String(user._id),
    role: user.role,
    campus: user.campus,
  };

  const token: string = jwt.sign(
    tokenPayload as unknown as Record<string, unknown>,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as unknown as number }
  );

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
export const getUserProfile = async (userId: string): Promise<IUserDocument | null> => {
  return User.findById(userId).select('-password');
};
