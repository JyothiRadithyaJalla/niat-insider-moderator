import Announcement, { IAnnouncementDocument } from '../models/Announcement.model.js';
import { AnnouncementType } from '../types/announcement.types.js';

/**
 * Fetches announcements for a specific campus with basic pagination.
 */
export const getAnnouncementsByCampus = async (
  campus: string,
  page: number = 1,
  limit: number = 10
): Promise<{ announcements: IAnnouncementDocument[]; total: number }> => {
  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    Announcement.find({ campus })
      .sort({ pinned: -1, createdAt: -1 }) // Pinned first, then newest
      .skip(skip)
      .limit(limit)
      .lean(),
    Announcement.countDocuments({ campus }),
  ]);

  return { 
    announcements: announcements as unknown as IAnnouncementDocument[], 
    total 
  };
};

/**
 * Fetches a single announcement by ID, verified by campus.
 */
export const getAnnouncementById = async (
  id: string,
  campus: string
): Promise<IAnnouncementDocument | null> => {
  return Announcement.findOne({ _id: id, campus });
};

/**
 * Creates a new announcement.
 */
export const createAnnouncement = async (data: {
  title: string;
  content: string;
  type: AnnouncementType;
  pinned?: boolean | undefined;
  campus: string;
  authorId: string;
}): Promise<IAnnouncementDocument> => {
  const announcement = new Announcement(data);
  return announcement.save();
};

/**
 * Updates an announcement, verified by campus.
 */
export const updateAnnouncement = async (
  id: string,
  campus: string,
  data: Partial<{
    title: string | undefined;
    content: string | undefined;
    type: AnnouncementType | undefined;
    pinned: boolean | undefined;
  }>
): Promise<IAnnouncementDocument | null> => {
  return Announcement.findOneAndUpdate(
    { _id: id, campus },
    { $set: data },
    { new: true, runValidators: true }
  );
};

/**
 * Deletes an announcement, verified by campus.
 */
export const deleteAnnouncement = async (
  id: string,
  campus: string
): Promise<IAnnouncementDocument | null> => {
  return Announcement.findOneAndDelete({ _id: id, campus });
};
