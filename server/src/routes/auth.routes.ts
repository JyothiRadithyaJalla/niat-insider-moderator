import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router: Router = Router();

// POST /api/auth/login — Authenticate user
router.post('/login', login);

// GET /api/auth/me — Get authenticated user profile
router.get('/me', authenticate, getMe);

export default router;
