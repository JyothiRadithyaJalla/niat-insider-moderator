import { Router } from 'express';
import { 
  getSchedules, addSchedule, updateSchedule, deleteSchedule,
  getTracks, addTrack, updateTrack, deleteTrack,
  getEvents, addEvent, deleteEvent
} from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { campusScopeGuard } from '../middleware/authorise.js';

const router = Router();

router.use(authenticate);
router.use(campusScopeGuard);

// Heartbeat for diagnostic checking
router.get('/heartbeat', (_req, res) => res.json({ status: 'router-active', timestamp: new Date().toISOString() }));

// Schedules
router.get('/schedules', getSchedules);
router.post('/schedules', addSchedule);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);

// Tracks
router.get('/tracks', getTracks);
router.post('/tracks', addTrack);
router.put('/tracks/:id', updateTrack);
router.delete('/tracks/:id', deleteTrack);

// Events
router.get('/events', getEvents);
router.post('/events', addEvent);
router.delete('/events/:id', deleteEvent);

export default router;
