import { Router } from 'express';
import {
  getArticles,
  getArticle,
  addArticle,
  editArticle,
  removeArticle,
} from '../controllers/article.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorise, campusScopeGuard } from '../middleware/authorise.js';
import { UserRole } from '../types/auth.types.js';

const router: Router = Router();

// All article routes require authentication + role check + campus scope
router.use(authenticate);
router.use(authorise(UserRole.MODERATOR, UserRole.ADMIN));
router.use(campusScopeGuard);

// GET    /api/articles      — List articles (campus-scoped, paginated)
router.get('/', getArticles);

// GET    /api/articles/:id  — Get single article
router.get('/:id', getArticle);

// POST   /api/articles      — Create article
router.post('/', addArticle);

// PUT    /api/articles/:id  — Update article
router.put('/:id', editArticle);

// DELETE /api/articles/:id  — Delete article
router.delete('/:id', removeArticle);

export default router;
