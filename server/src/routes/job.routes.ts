import { Router } from 'express';
import {
  getJobs,
  getJob,
  addJob,
  editJob,
  removeJob,
} from '../controllers/job.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorise, campusScopeGuard } from '../middleware/authorise.js';
import { UserRole } from '../types/auth.types.js';

const router: Router = Router();

// Standard middleware stack
router.use(authenticate);
router.use(authorise(UserRole.MODERATOR, UserRole.ADMIN));
router.use(campusScopeGuard);

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', addJob);
router.put('/:id', editJob);
router.delete('/:id', removeJob);

export default router;
