import { Router } from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  addAnnouncement,
  editAnnouncement,
  removeAnnouncement,
} from '../controllers/announcement.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorise, campusScopeGuard } from '../middleware/authorise.js';
import { UserRole } from '../types/auth.types.js';

const router: Router = Router();

// All announcement routes require authentication + role check + campus scope
router.use(authenticate);
router.use(authorise(UserRole.MODERATOR, UserRole.ADMIN));
router.use(campusScopeGuard);

// GET    /api/announcements      — List announcements
router.get('/', getAnnouncements);

// GET    /api/announcements/:id  — Get single announcement
router.get('/:id', getAnnouncement);

// POST   /api/announcements      — Create announcement
router.post('/', addAnnouncement);

// PUT    /api/announcements/:id  — Update announcement
router.put('/:id', editAnnouncement);

// DELETE /api/announcements/:id  — Delete announcement
router.delete('/:id', removeAnnouncement);

export default router;
