import { Request, Response } from 'express';
import { loginUser, signupUser, getUserProfile } from '../services/auth.service.js';
import { HttpStatus } from '../types/auth.types.js';
// Import to activate the global Express.Request augmentation (adds req.user)
import '../middleware/authenticate.js';

/**
 * POST /api/auth/signup
 * Registers a new user and returns JWT token.
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, campus } = req.body;

    if (!name || !email || !password || !campus) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'All fields are required.' });
      return;
    }

    const result = await signupUser({ name, email, password, campus });
    res.status(HttpStatus.CREATED).json({
      message: 'Account created successfully.',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed.';
    res.status(HttpStatus.BAD_REQUEST).json({ message });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user with email & password, returns JWT token.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Email and password are required.' });
      return;
    }

    const result = await loginUser(email, password);
    res.status(HttpStatus.OK).json({
      message: 'Login successful.',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    res.status(HttpStatus.UNAUTHORIZED).json({ message });
  }
};

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile.
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    const user = await getUserProfile(req.user.userId);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
      return;
    }

    res.status(HttpStatus.OK).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile.';
    res.status(500).json({ message });
  }
};
