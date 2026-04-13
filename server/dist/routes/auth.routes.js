import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
const router = Router();
// POST /api/auth/signup — Register new moderator
// router.post('/signup', signup);
// POST /api/auth/login — Authenticate user
router.post('/login', login);
// GET /api/auth/me — Get authenticated user profile
router.get('/me', authenticate, getMe);
export default router;
//# sourceMappingURL=auth.routes.js.map