import { Request, Response } from 'express';
import {
  getAnnouncementsByCampus,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../services/announcement.service.js';
import { HttpStatus } from '../types/auth.types.js';
import { AnnouncementType } from '../types/announcement.types.js';

/**
 * GET /api/announcements
 */
export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    const page = parseInt(req.query['page'] as string, 10) || 1;
    const limit = parseInt(req.query['limit'] as string, 10) || 20;

    const result = await getAnnouncementsByCampus(req.user.campus, page, limit);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch announcements.';
    res.status(500).json({ message });
  }
};

/**
 * GET /api/announcements/:id
 */
export const getAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    const announcement = await getAnnouncementById(req.params['id'] as string, req.user.campus);
    if (!announcement) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Announcement not found.' });
      return;
    }

    res.status(HttpStatus.OK).json({ announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch announcement.';
    res.status(500).json({ message });
  }
};

/**
 * POST /api/announcements
 */
export const addAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    const { title, content, type, pinned } = req.body as {
      title: string;
      content: string;
      type: AnnouncementType;
      pinned?: boolean;
    };

    if (!title || !content || !type) {
      res.status(400).json({ message: 'Title, content, and type are required.' });
      return;
    }

    const announcement = await createAnnouncement({
      title,
      content,
      type,
      pinned,
      campus: req.user.campus,
      authorId: req.user.userId,
    });

    res.status(HttpStatus.CREATED).json({ message: 'Announcement created.', announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create announcement.';
    res.status(500).json({ message });
  }
};

/**
 * PUT /api/announcements/:id
 */
export const editAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    const { title, content, type, pinned } = req.body as {
      title?: string;
      content?: string;
      type?: AnnouncementType;
      pinned?: boolean;
    };

    const announcement = await updateAnnouncement(req.params['id'] as string, req.user.campus, {
      title,
      content,
      type,
      pinned,
    });

    if (!announcement) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Announcement not found or not in your campus.' });
      return;
    }

    res.status(HttpStatus.OK).json({ message: 'Announcement updated.', announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update announcement.';
    res.status(500).json({ message });
  }
};

/**
 * DELETE /api/announcements/:id
 */
export const removeAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    const announcement = await deleteAnnouncement(req.params['id'] as string, req.user.campus);
    if (!announcement) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Announcement not found or not in your campus.' });
      return;
    }

    res.status(HttpStatus.OK).json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete announcement.';
    res.status(500).json({ message });
  }
};
